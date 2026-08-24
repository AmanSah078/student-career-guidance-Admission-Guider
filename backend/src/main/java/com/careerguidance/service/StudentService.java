package com.careerguidance.service;

import com.careerguidance.dto.ForgotPasswordRequest;
import com.careerguidance.dto.LoginRequest;
import com.careerguidance.dto.RegisterRequest;
import com.careerguidance.dto.ResetPasswordRequest;
import com.careerguidance.dto.StudentResponseDto;

import com.careerguidance.entity.EducationPath;

public interface StudentService {
    StudentResponseDto registerStudent(RegisterRequest request);
    StudentResponseDto loginStudent(LoginRequest request);
    void initiatePasswordReset(ForgotPasswordRequest request);
    StudentResponseDto resetPassword(ResetPasswordRequest request);
    StudentResponseDto verifyEmailOtp(String email, String otp);
    void resendVerificationOtp(String email);
    StudentResponseDto updateEducationPath(Long studentId, EducationPath educationPath);
    StudentResponseDto selectProgram(Long studentId, Long programId);
}
