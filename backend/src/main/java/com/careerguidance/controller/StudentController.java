package com.careerguidance.controller;

import com.careerguidance.dto.ApiResponse;
import com.careerguidance.dto.EducationPathRequest;
import com.careerguidance.dto.StudentResponseDto;
import com.careerguidance.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/education-path")
    public ResponseEntity<ApiResponse<StudentResponseDto>> saveEducationPath(@Valid @RequestBody EducationPathRequest request) {
        StudentResponseDto updatedStudent = studentService.updateEducationPath(request.getStudentId(), request.getEducationPath());
        return ResponseEntity.ok(ApiResponse.success("Education path saved successfully!", updatedStudent));
    }

    @PostMapping("/select-program")
    public ResponseEntity<ApiResponse<StudentResponseDto>> selectProgram(@Valid @RequestBody com.careerguidance.dto.SelectProgramRequest request) {
        StudentResponseDto updatedStudent = studentService.selectProgram(request.getStudentId(), request.getProgramId());
        return ResponseEntity.ok(ApiResponse.success("Program selection saved successfully!", updatedStudent));
    }
}
