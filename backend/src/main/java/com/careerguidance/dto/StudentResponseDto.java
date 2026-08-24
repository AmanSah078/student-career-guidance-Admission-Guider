package com.careerguidance.dto;

import com.careerguidance.entity.EducationPath;
import com.careerguidance.entity.Student;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponseDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private boolean verified;
    private String verificationOtp;
    private EducationPath educationPath;
    private ProgramDto selectedProgram;
    private LocalDateTime createdAt;

    public static StudentResponseDto fromEntity(Student student) {
        return StudentResponseDto.builder()
                .id(student.getId())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .verified(student.isVerified())
                .educationPath(student.getEducationPath())
                .selectedProgram(ProgramDto.fromEntity(student.getSelectedProgram()))
                .createdAt(student.getCreatedAt())
                .build();
    }
}
