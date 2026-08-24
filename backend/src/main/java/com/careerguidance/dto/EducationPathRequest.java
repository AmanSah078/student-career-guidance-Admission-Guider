package com.careerguidance.dto;

import com.careerguidance.entity.EducationPath;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationPathRequest {

    @NotNull(message = "Student ID is required.")
    private Long studentId;

    @NotNull(message = "Education path selection is required.")
    private EducationPath educationPath;
}
