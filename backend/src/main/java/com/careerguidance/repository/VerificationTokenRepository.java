package com.careerguidance.repository;

import com.careerguidance.entity.Student;
import com.careerguidance.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByStudent(Student student);
    Optional<VerificationToken> findByStudentAndUsedFalse(Student student);
    Optional<VerificationToken> findByStudentAndTokenAndUsedFalse(Student student, String token);
    void deleteByStudent(Student student);
}
