package com.careerguidance.service;

import com.careerguidance.dto.ForgotPasswordRequest;
import com.careerguidance.dto.LoginRequest;
import com.careerguidance.dto.RegisterRequest;
import com.careerguidance.dto.ResetPasswordRequest;
import com.careerguidance.dto.StudentResponseDto;
import com.careerguidance.entity.PasswordResetToken;
import com.careerguidance.entity.Student;
import com.careerguidance.entity.VerificationToken;
import com.careerguidance.exception.AppException;
import com.careerguidance.exception.InvalidTokenException;
import com.careerguidance.exception.ResourceAlreadyExistsException;
import com.careerguidance.repository.PasswordResetTokenRepository;
import com.careerguidance.repository.StudentRepository;
import com.careerguidance.repository.VerificationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class StudentServiceImpl implements StudentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentServiceImpl.class);
    private static final SecureRandom OTP_RANDOM = new SecureRandom();

    private final StudentRepository studentRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final com.careerguidance.repository.ProgramRepository programRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final SmsService smsService;

    @Value("${app.verification.otp-expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${spring.mail.username:}")
    private String mailSenderEmail;

    @Value("${spring.mail.password:}")
    private String mailSenderPassword;

    @Value("${app.sms.twilio.account-sid:}")
    private String twilioAccountSid;

    @Value("${app.sms.twilio.auth-token:}")
    private String twilioAuthToken;

    @Value("${app.sms.twilio.from-phone:}")
    private String twilioFromPhone;

    public StudentServiceImpl(StudentRepository studentRepository,
                              VerificationTokenRepository verificationTokenRepository,
                              PasswordResetTokenRepository passwordResetTokenRepository,
                              com.careerguidance.repository.ProgramRepository programRepository,
                              PasswordEncoder passwordEncoder,
                              MailService mailService,
                              SmsService smsService) {
        this.studentRepository = studentRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.programRepository = programRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
        this.smsService = smsService;
    }

    @Override
    @Transactional
    public StudentResponseDto registerStudent(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String normalizedPhone = request.getPhone().trim();

        // 1. Password Confirmation Check
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException("Passwords do not match.");
        }

        // 2. Uniqueness Checks
        if (studentRepository.existsByEmail(normalizedEmail)) {
            throw new ResourceAlreadyExistsException("Email address is already registered.");
        }

        if (studentRepository.existsByPhone(normalizedPhone)) {
            throw new ResourceAlreadyExistsException("Phone number is already registered.");
        }

        // 3. BCrypt Password Hashing
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 4. Create and Save Student Account
        Student student = Student.builder()
                .fullName(request.getFullName().trim())
                .email(normalizedEmail)
                .phone(normalizedPhone)
                .password(encodedPassword)
                .verified(false)
                .build();

        Student savedStudent = studentRepository.save(student);

        // 5. Generate OTP
        VerificationToken verificationOtp = createVerificationOtp(savedStudent);
        verificationTokenRepository.save(verificationOtp);

        // 6. Send OTP through email and phone SMS when providers are configured.
        String devOtp = dispatchVerificationOtp(savedStudent, verificationOtp.getToken());

        StudentResponseDto responseDto = StudentResponseDto.fromEntity(savedStudent);
        if (devOtp != null) {
            responseDto.setVerificationOtp(devOtp);
        }
        return responseDto;
    }

    @Override
    @Transactional
    public StudentResponseDto loginStudent(LoginRequest request) {
        Student student = studentRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new AppException("Invalid email or password."));

        if (!student.isVerified()) {
            resendVerificationOtp(student.getEmail());
            throw new AppException("UNVERIFIED_ACCOUNT: Your email is not verified yet. A fresh OTP has been sent to " + student.getEmail() + ".");
        }

        if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            throw new AppException("WRONG_PASSWORD: Invalid email or password. If you forgot your password, click 'Reset Password' to receive an OTP on your email.");
        }

        return StudentResponseDto.fromEntity(student);
    }

    @Override
    @Transactional
    public void initiatePasswordReset(ForgotPasswordRequest request) {
        studentRepository.findByEmail(request.getEmail().trim().toLowerCase()).ifPresent(student -> {
            PasswordResetToken existingToken = passwordResetTokenRepository.findByStudentAndUsedFalse(student)
                    .orElse(null);

            if (existingToken != null && !existingToken.isExpired()) {
                mailService.sendPasswordResetEmail(student.getEmail(), student.getFullName(), existingToken.getToken());
                return;
            }

            PasswordResetToken tokenRecord = passwordResetTokenRepository.findByStudent(student)
                    .orElse(null);

            if (tokenRecord != null) {
                tokenRecord.setToken(generatePasswordResetToken());
                tokenRecord.setExpiryDate(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
                tokenRecord.setUsed(false);
                passwordResetTokenRepository.save(tokenRecord);
                mailService.sendPasswordResetEmail(student.getEmail(), student.getFullName(), tokenRecord.getToken());
                return;
            }

            PasswordResetToken passwordResetToken = createPasswordResetToken(student);
            passwordResetTokenRepository.save(passwordResetToken);
            mailService.sendPasswordResetEmail(student.getEmail(), student.getFullName(), passwordResetToken.getToken());
        });
    }

    @Override
    @Transactional
    public StudentResponseDto resetPassword(ResetPasswordRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException("Passwords do not match.");
        }

        Student student = studentRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new AppException("Invalid reset token or email address."));

        PasswordResetToken resetToken = passwordResetTokenRepository.findByStudentAndTokenAndUsedFalse(student, request.getToken().trim())
                .orElseThrow(() -> new InvalidTokenException("Invalid password reset token or OTP."));

        if (resetToken.isExpired()) {
            throw new InvalidTokenException("Password reset OTP has expired. Please request a new one.");
        }

        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setVerified(true);
        Student updatedStudent = studentRepository.save(student);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return StudentResponseDto.fromEntity(updatedStudent);
    }

    @Override
    @Transactional
    public StudentResponseDto verifyEmailOtp(String email, String otp) {
        Student student = studentRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new AppException("No account found with this email address."));

        if (student.isVerified()) {
            return StudentResponseDto.fromEntity(student);
        }

        VerificationToken verificationToken = verificationTokenRepository.findByStudentAndTokenAndUsedFalse(student, otp.trim())
                .orElseThrow(() -> new InvalidTokenException("Invalid verification OTP."));

        if (verificationToken.isUsed()) {
            throw new InvalidTokenException("Verification OTP has already been used.");
        }

        if (verificationToken.isExpired()) {
            throw new InvalidTokenException("Verification OTP has expired. Please request a new OTP.");
        }

        // Mark OTP as used
        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);

        // Mark student as verified
        Student verifiedStudent = verificationToken.getStudent();
        verifiedStudent.setVerified(true);
        studentRepository.save(verifiedStudent);

        logger.info("Student account verified successfully for email: {}", verifiedStudent.getEmail());
        return StudentResponseDto.fromEntity(verifiedStudent);
    }

    @Override
    @Transactional
    public void resendVerificationOtp(String email) {
        Student student = studentRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new AppException("No account found with this email address."));

        if (student.isVerified()) {
            throw new AppException("This account is already verified.");
        }

        VerificationToken existingToken = verificationTokenRepository.findByStudent(student).orElse(null);
        if (existingToken != null) {
            existingToken.setToken(generateVerificationOtp());
            existingToken.setExpiryDate(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
            existingToken.setUsed(false);
            verificationTokenRepository.save(existingToken);
            dispatchVerificationOtp(student, existingToken.getToken());
            return;
        }

        VerificationToken newOtp = createVerificationOtp(student);
        verificationTokenRepository.save(newOtp);
        dispatchVerificationOtp(student, newOtp.getToken());
    }

    @Override
    @Transactional
    public StudentResponseDto updateEducationPath(Long studentId, com.careerguidance.entity.EducationPath educationPath) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException("Student account not found with ID: " + studentId));

        if (!student.isVerified()) {
            throw new AppException("Your account must be verified before choosing an education path.");
        }

        student.setEducationPath(educationPath);
        Student savedStudent = studentRepository.save(student);

        logger.info("Updated education path for student ID {} to {}", studentId, educationPath);
        return StudentResponseDto.fromEntity(savedStudent);
    }

    @Override
    @Transactional
    public StudentResponseDto selectProgram(Long studentId, Long programId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException("Student account not found with ID: " + studentId));

        if (!student.isVerified()) {
            throw new AppException("Your account must be verified before selecting a program.");
        }

        com.careerguidance.entity.Program program = programRepository.findById(programId)
                .orElseThrow(() -> new AppException("Selected program not found with ID: " + programId));

        if (student.getEducationPath() != null && !student.getEducationPath().equals(program.getEducationPath())) {
            throw new AppException("Selected program does not belong to your chosen education path (" + student.getEducationPath() + ").");
        }

        student.setSelectedProgram(program);
        Student savedStudent = studentRepository.save(student);

        logger.info("Student ID {} selected program: {} (ID: {})", studentId, program.getName(), programId);
        return StudentResponseDto.fromEntity(savedStudent);
    }

    private VerificationToken createVerificationOtp(Student student) {
        return VerificationToken.builder()
                .token(generateVerificationOtp())
                .student(student)
                .expiryDate(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                .used(false)
                .build();
    }

    private void deactivatePreviousOtp(Student student) {
        verificationTokenRepository.findByStudentAndUsedFalse(student).ifPresent(oldToken -> {
            oldToken.setUsed(true);
            verificationTokenRepository.save(oldToken);
        });
    }

    private String dispatchVerificationOtp(Student student, String otp) {
        boolean emailDelivered = false;
        boolean smsDelivered = false;

        if (isEmailConfigured()) {
            try {
                mailService.sendVerificationEmail(student.getEmail(), student.getFullName(), otp);
                emailDelivered = true;
            } catch (Exception e) {
                logger.warn("Could not dispatch OTP email for {}: {}", student.getEmail(), e.getMessage());
            }
        } else {
            logger.warn("Mail credentials are not configured. Development OTP for {} is {}", student.getEmail(), otp);
        }

        if (isSmsConfigured()) {
            try {
                smsService.sendVerificationOtp(student.getPhone(), student.getFullName(), otp);
                smsDelivered = true;
            } catch (Exception e) {
                logger.warn("Could not dispatch OTP SMS for {}: {}", student.getPhone(), e.getMessage());
            }
        } else {
            logger.warn("SMS credentials are not configured. Development phone OTP for {} is {}", student.getPhone(), otp);
        }

        if (!emailDelivered && !smsDelivered) {
            return otp;
        }
        return null;
    }

    private boolean isEmailConfigured() {
        return mailSenderEmail != null && !mailSenderEmail.isBlank()
                && mailSenderPassword != null && !mailSenderPassword.isBlank();
    }

    private boolean isSmsConfigured() {
        return twilioAccountSid != null && !twilioAccountSid.isBlank()
                && twilioAuthToken != null && !twilioAuthToken.isBlank()
                && twilioFromPhone != null && !twilioFromPhone.isBlank();
    }

    private String generateVerificationOtp() {
        for (int attempt = 0; attempt < 10; attempt++) {
            String otp = String.format("%06d", OTP_RANDOM.nextInt(1_000_000));
            boolean usedInVerification = verificationTokenRepository.findByToken(otp).isPresent();
            boolean usedInReset = passwordResetTokenRepository.findByToken(otp).isPresent();
            if (!usedInVerification && !usedInReset) {
                return otp;
            }
        }
        throw new AppException("Could not generate a unique verification OTP. Please try again.");
    }

    private String generatePasswordResetToken() {
        for (int attempt = 0; attempt < 10; attempt++) {
            String token = String.format("%06d", OTP_RANDOM.nextInt(1_000_000));
            if (verificationTokenRepository.findByToken(token).isEmpty()
                    && passwordResetTokenRepository.findByToken(token).isEmpty()) {
                return token;
            }
        }
        throw new AppException("Could not generate a unique password reset OTP. Please try again.");
    }

    private PasswordResetToken createPasswordResetToken(Student student) {
        return PasswordResetToken.builder()
                .token(generatePasswordResetToken())
                .student(student)
                .expiryDate(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                .used(false)
                .build();
    }
}
