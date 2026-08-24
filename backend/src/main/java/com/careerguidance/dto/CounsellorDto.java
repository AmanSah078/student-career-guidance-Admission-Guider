package com.careerguidance.dto;

import com.careerguidance.entity.Counsellor;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounsellorDto {
    private Long id;
    private String name;
    private String designation;
    private String profileImage;
    private String bio;
    private String experience;
    private String phone;
    private String email;
    private List<String> handledProgramNames;
    private List<Long> handledProgramIds;

    public static CounsellorDto fromEntity(Counsellor counsellor) {
        if (counsellor == null) return null;

        List<String> programNames = counsellor.getHandledPrograms() == null ? List.of() :
                counsellor.getHandledPrograms().stream()
                        .map(p -> p.getName())
                        .collect(Collectors.toList());

        List<Long> programIds = counsellor.getHandledPrograms() == null ? List.of() :
                counsellor.getHandledPrograms().stream()
                        .map(p -> p.getId())
                        .collect(Collectors.toList());

        return CounsellorDto.builder()
                .id(counsellor.getId())
                .name(counsellor.getName())
                .designation(counsellor.getDesignation())
                .profileImage(getInitials(counsellor.getName()))
                .bio(counsellor.getBio())
                .experience(counsellor.getExperience())
                .phone(counsellor.getPhone())
                .email(counsellor.getEmail())
                .handledProgramNames(programNames)
                .handledProgramIds(programIds)
                .build();
    }

    private static String getInitials(String name) {
        if (name == null || name.isBlank()) {
            return "AD";
        }

        String[] parts = name.trim().split("\\s+");
        StringBuilder initials = new StringBuilder();
        for (String part : parts) {
            if (!part.isBlank()) {
                initials.append(Character.toUpperCase(part.charAt(0)));
            }
            if (initials.length() == 2) {
                break;
            }
        }

        return initials.length() == 0 ? "AD" : initials.toString();
    }
}
