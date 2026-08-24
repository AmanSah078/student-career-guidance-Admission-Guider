package com.careerguidance.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class MailServiceImpl implements MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    @Value("${spring.mail.password:}")
    private String senderPassword;

    @Value("${app.mail.from:}")
    private String fromAddress;

    @Value("${app.verification.otp-expiry-minutes:10}")
    private int otpExpiryMinutes;

    public MailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendVerificationEmail(String recipientEmail, String recipientName, String otp) {
        if (senderEmail == null || senderEmail.isBlank() || senderPassword == null || senderPassword.isBlank()) {
            logger.warn("Mail credentials are not configured. Development OTP for {} is {}", recipientEmail, otp);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(fromAddress != null && !fromAddress.isBlank() ? fromAddress : senderEmail, "SeniorGuide Admissions");
            helper.setTo(recipientEmail);
            helper.setSubject("Your SeniorGuide Email Verification OTP");
            helper.setText(buildVerificationEmailHtml(recipientName, otp), true);

            mailSender.send(message);
            logger.info("Verification OTP email successfully sent to: {}", recipientEmail);
        } catch (MessagingException e) {
            logger.error("Failed to send verification email to {}: {}", recipientEmail, e.getMessage());
            throw new RuntimeException("Verification email could not be sent. Please check the email address or try again.", e);
        } catch (Exception e) {
            logger.error("Unexpected error sending verification email to {}: {}", recipientEmail, e.getMessage());
            throw new RuntimeException("Verification email could not be sent. Please try again.", e);
        }
    }

    private String buildVerificationEmailHtml(String name, String otp) {
        String safeName = name == null || name.isBlank() ? "Student" : name;
        String template = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d1117; color: #e6edf3; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 32px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
                .header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #30363d; }
                .brand { font-size: 24px; font-weight: 700; color: #58a6ff; text-decoration: none; }
                .content { padding: 24px 0; font-size: 16px; line-height: 1.6; color: #c9d1d9; }
                .otp-box { background: #0d1117; border: 1px solid #30363d; color: #ffffff; font-family: 'Segoe UI', monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; text-align: center; padding: 18px; border-radius: 8px; margin: 28px 0; }
                .footer { font-size: 13px; color: #8b949e; text-align: center; border-top: 1px solid #30363d; padding-top: 20px; margin-top: 24px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="brand">SeniorGuide</div>
                </div>
                <div class="content">
                  <h2>Welcome to SeniorGuide, {{NAME}}!</h2>
                  <p>Thank you for registering on our Student Career Guidance and Admission Platform. Enter the OTP below on the verification page to activate your account.</p>
                  <div class="otp-box">{{OTP}}</div>
                  <p style="margin-top: 24px; font-size: 14px; color: #8b949e;">This OTP will expire in {{EXPIRY_MINUTES}} minutes. If you did not request this account, you can ignore this email.</p>
                </div>
                <div class="footer">
                  <p>SeniorGuide Platform. Genuinely guiding students towards higher education.</p>
                </div>
              </div>
            </body>
            </html>
            """;

        return template.replace("{{NAME}}", safeName)
                .replace("{{OTP}}", otp)
                .replace("{{EXPIRY_MINUTES}}", String.valueOf(otpExpiryMinutes));
    }

    @Override
    public void sendPasswordResetEmail(String recipientEmail, String recipientName, String token) {
        if (senderEmail == null || senderEmail.isBlank() || senderPassword == null || senderPassword.isBlank()) {
            logger.warn("Mail credentials are not configured. Password reset token for {} is {}", recipientEmail, token);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(fromAddress != null && !fromAddress.isBlank() ? fromAddress : senderEmail, "SeniorGuide Admissions");
            helper.setTo(recipientEmail);
            helper.setSubject("SeniorGuide Password Reset Instructions");
            helper.setText(buildPasswordResetEmailHtml(recipientName, token), true);

            mailSender.send(message);
            logger.info("Password reset email successfully sent to: {}", recipientEmail);
        } catch (MessagingException e) {
            logger.error("Failed to send password reset email to {}: {}", recipientEmail, e.getMessage());
            throw new RuntimeException("Password reset email could not be sent. Please try again.", e);
        } catch (Exception e) {
            logger.error("Unexpected error sending password reset email to {}: {}", recipientEmail, e.getMessage());
            throw new RuntimeException("Password reset email could not be sent. Please try again.", e);
        }
    }

    private String buildPasswordResetEmailHtml(String name, String token) {
        String safeName = name == null || name.isBlank() ? "Student" : name;
        String template = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset=\"utf-8\">
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d1117; color: #e6edf3; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 32px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
                .header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #30363d; }
                .brand { font-size: 24px; font-weight: 700; color: #58a6ff; text-decoration: none; }
                .content { padding: 24px 0; font-size: 16px; line-height: 1.6; color: #c9d1d9; }
                .token-box { background: #0d1117; border: 1px solid #30363d; color: #ffffff; font-family: 'Segoe UI', monospace; font-size: 20px; font-weight: 800; letter-spacing: 1px; text-align: center; padding: 18px; border-radius: 8px; margin: 28px 0; }
                .footer { font-size: 13px; color: #8b949e; text-align: center; border-top: 1px solid #30363d; padding-top: 20px; margin-top: 24px; }
              </style>
            </head>
            <body>
              <div class=\"container\">
                <div class=\"header\">
                  <div class=\"brand\">SeniorGuide</div>
                </div>
                <div class=\"content\">
                  <h2>Password Reset Request</h2>
                  <p>Hello {{NAME}},</p>
                  <p>We received a request to reset the password for your SeniorGuide account. Use the token below to reset your password.</p>
                  <div class=\"token-box\">{{TOKEN}}</div>
                  <p style=\"margin-top: 20px; font-size: 14px; color: #8b949e;\">This token is valid for {{EXPIRY_MINUTES}} minutes. If you did not request this, please ignore this email.</p>
                </div>
                <div class=\"footer\">
                  <p>SeniorGuide Platform. Genuinely guiding students towards higher education.</p>
                </div>
              </div>
            </body>
            </html>
            """;

        return template.replace("{{NAME}}", safeName)
                .replace("{{TOKEN}}", token)
                .replace("{{EXPIRY_MINUTES}}", String.valueOf(otpExpiryMinutes));
    }
}
