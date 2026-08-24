package com.careerguidance.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionEnquiryResponseDto {

    private Long id;
    private String studentName;
    private String studentEmail;
    private String programName;
    private String programCode;
    private String counsellorName;
    private String counsellorDesignation;
    private String message;
    private String status;
    private LocalDateTime submittedAt;
}
