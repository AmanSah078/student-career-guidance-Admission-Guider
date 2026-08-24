package com.careerguidance.service;

import com.careerguidance.dto.ProgramDto;
import com.careerguidance.entity.EducationPath;

import java.util.List;

public interface ProgramService {
    List<ProgramDto> getProgramsByEducationPath(EducationPath educationPath);
    ProgramDto getProgramById(Long id);
}
