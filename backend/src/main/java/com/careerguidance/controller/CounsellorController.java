package com.careerguidance.controller;

import com.careerguidance.dto.ApiResponse;
import com.careerguidance.dto.CounsellorDto;
import com.careerguidance.service.CounsellorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/counsellors")
public class CounsellorController {

    private final CounsellorService counsellorService;

    public CounsellorController(CounsellorService counsellorService) {
        this.counsellorService = counsellorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CounsellorDto>>> getCounsellors(
            @RequestParam(value = "programId", required = false) Long programId
    ) {
        List<CounsellorDto> counsellors = counsellorService.getCounsellors(programId);
        return ResponseEntity.ok(ApiResponse.success("Admission team profiles retrieved successfully.", counsellors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CounsellorDto>> getCounsellorById(@PathVariable("id") Long id) {
        CounsellorDto counsellor = counsellorService.getCounsellorById(id);
        return ResponseEntity.ok(ApiResponse.success("Counsellor profile retrieved successfully.", counsellor));
    }
}
