package com.project.back_end.services;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final TokenService tokenService;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            TokenService tokenService) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.tokenService = tokenService;
    }

    public int bookAppointment(Appointment appointment) {
        try {
            hydrateReferences(appointment);
            appointmentRepository.save(appointment);
            return 1;
        } catch (Exception exception) {
            return 0;
        }
    }

    @Transactional
    public ResponseEntity<Map<String, String>> updateAppointment(Appointment appointment, String token) {
        Map<String, String> response = new HashMap<>();
        Appointment existing = appointment.getId() == null
                ? null
                : appointmentRepository.findById(appointment.getId()).orElse(null);

        if (existing == null) {
            response.put("message", "Appointment not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Patient tokenPatient = patientRepository.findByEmail(tokenService.extractIdentifier(token));
        if (tokenPatient == null || !existing.getPatient().getId().equals(tokenPatient.getId())) {
            response.put("message", "Unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        int validation = validateAppointment(appointment, appointment.getId());
        if (validation == -1) {
            response.put("message", "Invalid doctor id");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        if (validation == 0) {
            response.put("message", "Appointment slot is unavailable");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        hydrateReferences(appointment);
        appointmentRepository.save(appointment);
        response.put("message", "Appointment updated");
        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<Map<String, String>> cancelAppointment(long id, String token) {
        Map<String, String> response = new HashMap<>();
        Appointment appointment = appointmentRepository.findById(id).orElse(null);

        if (appointment == null) {
            response.put("message", "Appointment not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Patient tokenPatient = patientRepository.findByEmail(tokenService.extractIdentifier(token));
        if (tokenPatient == null || !appointment.getPatient().getId().equals(tokenPatient.getId())) {
            response.put("message", "Unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        appointmentRepository.delete(appointment);
        response.put("message", "Appointment cancelled");
        return ResponseEntity.ok(response);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAppointment(String pname, LocalDate date, String token) {
        Doctor doctor = doctorRepository.findByEmail(tokenService.extractIdentifier(token));
        List<Appointment> appointments = List.of();

        if (doctor != null) {
            if (isBlank(pname)) {
                appointments = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                        doctor.getId(), date.atStartOfDay(), date.plusDays(1).atStartOfDay().minusNanos(1));
            } else {
                appointments = appointmentRepository.findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
                        doctor.getId(), pname, date.atStartOfDay(), date.plusDays(1).atStartOfDay().minusNanos(1));
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("appointments", appointments.stream().map(this::toDto).toList());
        return response;
    }

    @Transactional
    public void changeStatus(long appointmentId, int status) {
        appointmentRepository.findById(appointmentId).ifPresent(appointment -> {
            appointment.setStatus(status);
            appointmentRepository.save(appointment);
        });
    }

    @Transactional(readOnly = true)
    public int validateAppointment(Appointment appointment) {
        return validateAppointment(appointment, null);
    }

    private int validateAppointment(Appointment appointment, Long ignoredAppointmentId) {
        if (appointment.getDoctor() == null || appointment.getDoctor().getId() == null) {
            return -1;
        }

        Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId()).orElse(null);
        if (doctor == null) {
            return -1;
        }

        String requestedSlot = appointment.getAppointmentTime().toLocalTime().toString();
        boolean inDoctorSchedule = doctor.getAvailableTimes() != null
                && doctor.getAvailableTimes().stream()
                        .map(this::normalizeSlot)
                        .anyMatch(requestedSlot::equals);

        if (!inDoctorSchedule) {
            return 0;
        }

        LocalDate date = appointment.getAppointmentTime().toLocalDate();
        boolean alreadyBooked = appointmentRepository
                .findByDoctorIdAndAppointmentTimeBetween(doctor.getId(), date.atStartOfDay(), date.plusDays(1).atStartOfDay().minusNanos(1))
                .stream()
                .anyMatch(existing -> existing.getAppointmentTime().equals(appointment.getAppointmentTime())
                        && !existing.getId().equals(ignoredAppointmentId));

        return alreadyBooked ? 0 : 1;
    }

    private void hydrateReferences(Appointment appointment) {
        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null) {
            appointment.setDoctor(doctorRepository.findById(appointment.getDoctor().getId()).orElseThrow());
        }
        if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
            appointment.setPatient(patientRepository.findById(appointment.getPatient().getId()).orElseThrow());
        }
    }

    private AppointmentDTO toDto(Appointment appointment) {
        return new AppointmentDTO(
                appointment.getId(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getName(),
                appointment.getPatient().getId(),
                appointment.getPatient().getName(),
                appointment.getPatient().getEmail(),
                appointment.getPatient().getPhone(),
                appointment.getPatient().getAddress(),
                appointment.getAppointmentTime(),
                appointment.getStatus());
    }

    private String normalizeSlot(String slot) {
        return slot == null ? "" : LocalTime.parse(slot).toString();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank() || "null".equalsIgnoreCase(value);
    }
}
