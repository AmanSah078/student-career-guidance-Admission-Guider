package com.careerguidance.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class SmsServiceImpl implements SmsService {

    private static final Logger logger = LoggerFactory.getLogger(SmsServiceImpl.class);

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${app.sms.twilio.account-sid:}")
    private String accountSid;

    @Value("${app.sms.twilio.auth-token:}")
    private String authToken;

    @Value("${app.sms.twilio.from-phone:}")
    private String fromPhone;

    @Value("${app.sms.default-country-code:+91}")
    private String defaultCountryCode;

    @Value("${app.verification.otp-expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Override
    public void sendVerificationOtp(String recipientPhone, String recipientName, String otp) {
        String normalizedPhone = normalizePhone(recipientPhone);

        if (accountSid == null || accountSid.isBlank()
                || authToken == null || authToken.isBlank()
                || fromPhone == null || fromPhone.isBlank()) {
            logger.warn("SMS credentials are not configured. Development phone OTP for {} is {}", normalizedPhone, otp);
            return;
        }

        String message = "Your SeniorGuide verification OTP is " + otp
                + ". It expires in " + otpExpiryMinutes + " minutes.";

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json"))
                    .header("Authorization", "Basic " + basicAuth())
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(formBody(normalizedPhone, message)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new RuntimeException("SMS provider returned status " + response.statusCode());
            }

            logger.info("Verification OTP SMS successfully sent to: {}", normalizedPhone);
        } catch (IOException e) {
            logger.error("Failed to send OTP SMS to {}: {}", normalizedPhone, e.getMessage());
            throw new RuntimeException("Verification SMS could not be sent. Please check the phone number or try again.", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Verification SMS sending was interrupted. Please try again.", e);
        }
    }

    private String formBody(String toPhone, String message) {
        return "To=" + encode(toPhone)
                + "&From=" + encode(fromPhone)
                + "&Body=" + encode(message);
    }

    private String basicAuth() {
        String credentials = accountSid + ":" + authToken;
        return Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }

    private String normalizePhone(String phone) {
        if (phone == null || phone.isBlank()) {
            return "";
        }

        String cleaned = phone.replaceAll("[\\s()\\-]", "");
        if (cleaned.startsWith("+")) {
            return cleaned;
        }
        if (cleaned.startsWith("00")) {
            return "+" + cleaned.substring(2);
        }
        if (cleaned.length() == 10 && defaultCountryCode != null && !defaultCountryCode.isBlank()) {
            return defaultCountryCode + cleaned;
        }
        return cleaned;
    }

    private String encode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }
}
