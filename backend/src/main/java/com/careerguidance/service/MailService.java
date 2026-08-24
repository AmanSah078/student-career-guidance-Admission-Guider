package com.careerguidance.service;

public interface MailService {
    void sendVerificationEmail(String recipientEmail, String recipientName, String otp);
    void sendPasswordResetEmail(String recipientEmail, String recipientName, String token);
}
