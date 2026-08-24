package com.careerguidance.dto;

import com.careerguidance.entity.EducationPath;
import com.careerguidance.entity.Program;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramDto {
    private Long id;
    private String code;
    private String name;
    private EducationPath educationPath;
    private String shortDescription;
    private String duration;
    private String eligibility;
    private String overview;
    private String whatYouWillStudy;
    private String whyChoose;
    private String admissionProcess;
    private String studyMode;
    private Integer displayOrder;

    public static ProgramDto fromEntity(Program program) {
        if (program == null) return null;
        return ProgramDto.builder()
                .id(program.getId())
                .code(program.getCode())
                .name(program.getName())
                .educationPath(program.getEducationPath())
                .shortDescription(program.getShortDescription())
                .duration(program.getDuration())
                .eligibility(program.getEligibility())
                .overview(program.getOverview())
                .whatYouWillStudy(program.getWhatYouWillStudy())
                .whyChoose(program.getWhyChoose())
                .admissionProcess(program.getAdmissionProcess())
                .studyMode(program.getStudyMode())
                .displayOrder(program.getDisplayOrder())
                .build();
    }
}
