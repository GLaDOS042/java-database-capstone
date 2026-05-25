package com.project.back_end.services;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.PatientRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;

    public PatientService(
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository,
            TokenService tokenService) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
    }

    public int createPatient(Patient patient) {
        try {
            patientRepository.save(patient);
            return 1;
        } catch (Exception exception) {
            return 0;
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getPatientAppointment(Long id, String token) {
        Map<String, Object> response = new HashMap<>();
        Patient patient = patientRepository.findByEmail(tokenService.extractIdentifier(token));

        if (patient == null || !patient.getId().equals(id)) {
            response.put("message", "Unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        response.put("appointments", toDtos(appointmentRepository.findByPatientId(id)));
        return ResponseEntity.ok(response);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> filterByCondition(String condition, Long id) {
        Integer status = statusFromCondition(condition);
        if (status == null) {
            return error("Invalid condition", HttpStatus.BAD_REQUEST);
        }

        return appointmentsResponse(appointmentRepository.findByPatient_IdAndStatusOrderByAppointmentTimeAsc(id, status));
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> filterByDoctor(String name, Long patientId) {
        return appointmentsResponse(appointmentRepository.filterByDoctorNameAndPatientId(name, patientId));
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> filterByDoctorAndCondition(String condition, String name, long patientId) {
        Integer status = statusFromCondition(condition);
        if (status == null) {
            return error("Invalid condition", HttpStatus.BAD_REQUEST);
        }

        return appointmentsResponse(appointmentRepository.filterByDoctorNameAndPatientIdAndStatus(name, patientId, status));
    }

    public ResponseEntity<Map<String, Object>> getPatientDetails(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Patient patient = patientRepository.findByEmail(tokenService.extractIdentifier(token));
            if (patient == null) {
                response.put("message", "Patient not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            response.put("patient", patient);
            return ResponseEntity.ok(response);
        } catch (Exception exception) {
            response.put("message", "Unable to fetch patient details");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private ResponseEntity<Map<String, Object>> appointmentsResponse(List<Appointment> appointments) {
        Map<String, Object> response = new HashMap<>();
        response.put("appointments", toDtos(appointments));
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<Map<String, Object>> error(String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.status(status).body(response);
    }

    private List<AppointmentDTO> toDtos(List<Appointment> appointments) {
        return appointments.stream().map(this::toDto).toList();
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

    private Integer statusFromCondition(String condition) {
        if ("past".equalsIgnoreCase(condition) || "completed".equalsIgnoreCase(condition)) {
            return 1;
        }
        if ("future".equalsIgnoreCase(condition) || "upcoming".equalsIgnoreCase(condition)) {
            return 0;
        }
        return null;
    }
}
