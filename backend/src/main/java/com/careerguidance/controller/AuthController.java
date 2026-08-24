package com.careerguidance.controller;

import com.careerguidance.dto.*;
import com.careerguidance.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StudentService studentService;

    public AuthController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<StudentResponseDto>> registerStudent(@Valid @RequestBody RegisterRequest request) {
        StudentResponseDto responseDto = studentService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful! Please check your email for the OTP.", responseDto));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<StudentResponseDto>> loginStudent(@Valid @RequestBody LoginRequest request) {
        StudentResponseDto responseDto = studentService.loginStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful.", responseDto));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        studentService.initiatePasswordReset(request);
        return ResponseEntity.ok(ApiResponse.success("A password reset email has been sent if the account exists."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<StudentResponseDto>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        StudentResponseDto responseDto = studentService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Your password has been reset successfully.", responseDto));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<StudentResponseDto>> verifyEmailPost(@Valid @RequestBody VerifyEmailRequest request) {
        StudentResponseDto responseDto = studentService.verifyEmailOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully! Your account is now active.", responseDto));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        studentService.resendVerificationOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("A new OTP has been sent to your email address."));
    }
}
