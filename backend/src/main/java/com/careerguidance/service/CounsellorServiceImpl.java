package com.careerguidance.service;

import com.careerguidance.dto.CounsellorDto;
import com.careerguidance.entity.Counsellor;
import com.careerguidance.exception.AppException;
import com.careerguidance.repository.CounsellorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CounsellorServiceImpl implements CounsellorService {

    private final CounsellorRepository counsellorRepository;

    public CounsellorServiceImpl(CounsellorRepository counsellorRepository) {
        this.counsellorRepository = counsellorRepository;
    }

    @Override
    public List<CounsellorDto> getCounsellors(Long programId) {
        List<Counsellor> counsellors;
        if (programId != null) {
            counsellors = counsellorRepository.findByHandledProgramsIdAndActiveTrueOrderByDisplayOrderAsc(programId);
            // Fallback: If no specific counsellor assigned to this program ID, return all active advisors
            if (counsellors.isEmpty()) {
                counsellors = counsellorRepository.findByActiveTrueOrderByDisplayOrderAsc();
            }
        } else {
            counsellors = counsellorRepository.findByActiveTrueOrderByDisplayOrderAsc();
        }

        return counsellors.stream()
                .map(CounsellorDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CounsellorDto getCounsellorById(Long id) {
        Counsellor counsellor = counsellorRepository.findById(id)
                .orElseThrow(() -> new AppException("Admission counsellor profile not found with ID: " + id));
        return CounsellorDto.fromEntity(counsellor);
    }
}
