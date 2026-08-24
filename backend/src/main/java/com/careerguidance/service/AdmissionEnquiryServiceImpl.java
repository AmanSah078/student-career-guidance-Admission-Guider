package com.careerguidance.service;

import com.careerguidance.dto.AdmissionEnquiryRequest;
import com.careerguidance.dto.AdmissionEnquiryResponseDto;
import com.careerguidance.entity.*;
import com.careerguidance.exception.AppException;
import com.careerguidance.repository.AdmissionEnquiryRepository;
import com.careerguidance.repository.CounsellorRepository;
import com.careerguidance.repository.ProgramRepository;
import com.careerguidance.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdmissionEnquiryServiceImpl implements AdmissionEnquiryService {

    private static final Logger logger = LoggerFactory.getLogger(AdmissionEnquiryServiceImpl.class);

    private final AdmissionEnquiryRepository enquiryRepository;
    private final StudentRepository studentRepository;
    private final ProgramRepository programRepository;
    private final CounsellorRepository counsellorRepository;

    public AdmissionEnquiryServiceImpl(AdmissionEnquiryRepository enquiryRepository,
                                        StudentRepository studentRepository,
                                        ProgramRepository programRepository,
                                        CounsellorRepository counsellorRepository) {
        this.enquiryRepository = enquiryRepository;
        this.studentRepository = studentRepository;
        this.programRepository = programRepository;
        this.counsellorRepository = counsellorRepository;
    }

    @Override
    @Transactional
    public AdmissionEnquiryResponseDto submitEnquiry(AdmissionEnquiryRequest request) {

        // 1. Validate student
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new AppException("Student account not found. Please register and verify your account first."));

        if (!student.isVerified()) {
            throw new AppException("Your email address has not been verified yet. Please verify your account before submitting an enquiry.");
        }

        // 2. Validate program
        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new AppException("The selected program was not found. Please go back and select a valid program."));

        // 3. Validate counsellor
        Counsellor counsellor = counsellorRepository.findById(request.getCounsellorId())
                .orElseThrow(() -> new AppException("The selected counsellor was not found. Please go back and choose an advisor from our team."));

        if (!counsellor.isActive()) {
            throw new AppException("This advisor is currently unavailable. Please select another advisor from our team.");
        }

        // 4. Duplicate check: prevent same student re-submitting PENDING enquiry for same program+counsellor
        boolean duplicateExists = enquiryRepository.existsByStudentIdAndProgramIdAndCounsellorIdAndStatus(
                student.getId(), program.getId(), counsellor.getId(), EnquiryStatus.PENDING);

        if (duplicateExists) {
            throw new AppException("You already have a pending enquiry for this program with this advisor. Our team will contact you soon!");
        }

        // 5. Save enquiry
        AdmissionEnquiry enquiry = AdmissionEnquiry.builder()
                .student(student)
                .program(program)
                .counsellor(counsellor)
                .message(request.getMessage().trim())
                .status(EnquiryStatus.PENDING)
                .build();

        AdmissionEnquiry saved = enquiryRepository.save(enquiry);
        logger.info("Admission enquiry submitted: student={}, program={}, counsellor={}, enquiryId={}",
                student.getEmail(), program.getCode(), counsellor.getName(), saved.getId());

        // 6. Build and return safe response DTO
        return AdmissionEnquiryResponseDto.builder()
                .id(saved.getId())
                .studentName(student.getFullName())
                .studentEmail(student.getEmail())
                .programName(program.getName())
                .programCode(program.getCode())
                .counsellorName(counsellor.getName())
                .counsellorDesignation(counsellor.getDesignation())
                .message(saved.getMessage())
                .status(saved.getStatus().name())
                .submittedAt(saved.getCreatedAt())
                .build();
    }
}
