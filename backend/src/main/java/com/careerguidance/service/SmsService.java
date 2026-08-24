package com.careerguidance.service;

public interface SmsService {
    void sendVerificationOtp(String recipientPhone, String recipientName, String otp);
}
