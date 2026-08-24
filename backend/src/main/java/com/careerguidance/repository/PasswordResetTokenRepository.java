package com.careerguidance.repository;

import com.careerguidance.entity.PasswordResetToken;
import com.careerguidance.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByStudent(Student student);
    Optional<PasswordResetToken> findByStudentAndUsedFalse(Student student);
    Optional<PasswordResetToken> findByStudentAndTokenAndUsedFalse(Student student, String token);
    void deleteByStudent(Student student);
}
