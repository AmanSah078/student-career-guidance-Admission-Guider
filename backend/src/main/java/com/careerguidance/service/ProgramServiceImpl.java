package com.careerguidance.service;

import com.careerguidance.dto.ProgramDto;
import com.careerguidance.entity.EducationPath;
import com.careerguidance.entity.Program;
import com.careerguidance.exception.AppException;
import com.careerguidance.repository.ProgramRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProgramServiceImpl implements ProgramService {

    private final ProgramRepository programRepository;

    public ProgramServiceImpl(ProgramRepository programRepository) {
        this.programRepository = programRepository;
    }

    @Override
    public List<ProgramDto> getProgramsByEducationPath(EducationPath educationPath) {
        List<Program> programs = programRepository.findByEducationPathAndActiveTrueOrderByDisplayOrderAsc(educationPath);
        return programs.stream()
                .map(ProgramDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ProgramDto getProgramById(Long id) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new AppException("Program not found with ID: " + id));
        return ProgramDto.fromEntity(program);
    }
}
