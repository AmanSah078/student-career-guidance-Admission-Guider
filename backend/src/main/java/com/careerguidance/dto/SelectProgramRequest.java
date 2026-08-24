package com.careerguidance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SelectProgramRequest {

    @NotNull(message = "Student ID is required.")
    private Long studentId;

    @NotNull(message = "Program ID is required.")
    private Long programId;
}
