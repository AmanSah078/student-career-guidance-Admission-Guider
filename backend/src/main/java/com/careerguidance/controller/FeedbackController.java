package com.careerguidance.controller;

import com.careerguidance.dto.ApiResponse;
import com.careerguidance.dto.FeedbackRequest;
import com.careerguidance.dto.FeedbackResponseDto;
import com.careerguidance.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    /**
     * POST /api/feedback
     * Submit feedback from a verified student (initially PENDING).
     */
    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackResponseDto>> submitFeedback(
            @Valid @RequestBody FeedbackRequest request) {

        FeedbackResponseDto response = feedbackService.submitFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Thank you for sharing your experience! Your feedback will be reviewed before being displayed publicly.",
                        response));
    }

    /**
     * GET /api/feedback/public
     * Get list of approved student feedback for public display on the landing page.
     */
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<FeedbackResponseDto>>> getPublicFeedback() {
        List<FeedbackResponseDto> list = feedbackService.getPublicFeedback();
        return ResponseEntity.ok(ApiResponse.success("Public feedback retrieved successfully.", list));
    }
}
