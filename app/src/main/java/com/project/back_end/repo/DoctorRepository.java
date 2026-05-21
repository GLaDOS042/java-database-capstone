package com.project.back_end.repo;

import com.project.back_end.models.Doctor;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Doctor findByEmail(String email);

    List<Doctor> findByNameContainingIgnoreCase(String name);

    List<Doctor> findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(String name, String specialty);

    List<Doctor> findBySpecialtyIgnoreCase(String specialty);
}
