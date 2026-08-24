package com.careerguidance.repository;

import com.careerguidance.entity.EducationPath;
import com.careerguidance.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByEducationPathAndActiveTrueOrderByDisplayOrderAsc(EducationPath educationPath);
    Optional<Program> findByCode(String code);
}
