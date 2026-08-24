package com.careerguidance.service;

import com.careerguidance.dto.FeedbackRequest;
import com.careerguidance.dto.FeedbackResponseDto;

import java.util.List;

public interface FeedbackService {

    FeedbackResponseDto submitFeedback(FeedbackRequest request);

    List<FeedbackResponseDto> getPublicFeedback();
}
