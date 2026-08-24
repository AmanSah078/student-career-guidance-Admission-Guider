package com.careerguidance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdmissionEnquiryRequest {

    @NotNull(message = "Student ID is required.")
    private Long studentId;

    @NotNull(message = "Program ID is required.")
    private Long programId;

    @NotNull(message = "Counsellor ID is required.")
    private Long counsellorId;

    @NotBlank(message = "Please write a message or question for our admission team.")
    @Size(min = 10, max = 1000,
          message = "Your message should be between 10 and 1000 characters.")
    private String message;
}
