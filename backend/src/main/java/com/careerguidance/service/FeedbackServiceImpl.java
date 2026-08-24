package com.careerguidance.service;

import com.careerguidance.dto.FeedbackRequest;
import com.careerguidance.dto.FeedbackResponseDto;
import com.careerguidance.entity.Feedback;
import com.careerguidance.entity.FeedbackStatus;
import com.careerguidance.entity.Student;
import com.careerguidance.exception.AppException;
import com.careerguidance.repository.FeedbackRepository;
import com.careerguidance.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackServiceImpl.class);

    private final FeedbackRepository feedbackRepository;
    private final StudentRepository studentRepository;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository, StudentRepository studentRepository) {
        this.feedbackRepository = feedbackRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional
    public FeedbackResponseDto submitFeedback(FeedbackRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new AppException("Student account not found. Please register first."));

        if (!student.isVerified()) {
            throw new AppException("Your email address has not been verified yet.");
        }

        // Prevent rapid duplicate pending submissions from the same student
        boolean pendingExists = feedbackRepository.existsByStudentIdAndStatus(student.getId(), FeedbackStatus.PENDING);
        if (pendingExists) {
            throw new AppException("You already have a pending feedback submission being reviewed by our team.");
        }

        Feedback feedback = Feedback.builder()
                .student(student)
                .rating(request.getRating())
                .message(request.getMessage().trim())
                .status(FeedbackStatus.PENDING)
                .build();

        Feedback saved = feedbackRepository.save(feedback);
        logger.info("Feedback submitted by student email={}, rating={}", student.getEmail(), request.getRating());

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackResponseDto> getPublicFeedback() {
        return feedbackRepository.findByStatusOrderByCreatedAtDesc(FeedbackStatus.APPROVED)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private FeedbackResponseDto mapToDto(Feedback feedback) {
        Student s = feedback.getStudent();
        String pathStr = s.getEducationPath() != null ? s.getEducationPath().name() : null;
        String programStr = s.getSelectedProgram() != null ? s.getSelectedProgram().getName() : null;

        return FeedbackResponseDto.builder()
                .id(feedback.getId())
                .studentName(s.getFullName())
                .educationPath(pathStr)
                .programName(programStr)
                .rating(feedback.getRating())
                .message(feedback.getMessage())
                .status(feedback.getStatus().name())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
