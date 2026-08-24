package com.careerguidance.controller;

import com.careerguidance.dto.ApiResponse;
import com.careerguidance.dto.ProgramDto;
import com.careerguidance.entity.EducationPath;
import com.careerguidance.service.ProgramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programs")
public class ProgramController {

    private final ProgramService programService;

    public ProgramController(ProgramService programService) {
        this.programService = programService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProgramDto>>> getProgramsByPath(@RequestParam("path") EducationPath path) {
        List<ProgramDto> programs = programService.getProgramsByEducationPath(path);
        return ResponseEntity.ok(ApiResponse.success("Programs retrieved successfully.", programs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProgramDto>> getProgramById(@PathVariable("id") Long id) {
        ProgramDto program = programService.getProgramById(id);
        return ResponseEntity.ok(ApiResponse.success("Program retrieved successfully.", program));
    }
}
