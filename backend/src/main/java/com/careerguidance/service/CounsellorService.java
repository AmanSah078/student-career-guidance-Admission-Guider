package com.careerguidance.service;

import com.careerguidance.dto.CounsellorDto;

import java.util.List;

public interface CounsellorService {
    List<CounsellorDto> getCounsellors(Long programId);
    CounsellorDto getCounsellorById(Long id);
}
