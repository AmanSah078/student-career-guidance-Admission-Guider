package com.careerguidance.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponseDto {

    private Long id;
    private String studentName;
    private String educationPath;
    private String programName;
    private Integer rating;
    private String message;
    private String status;
    private LocalDateTime createdAt;
}
