package com.careerguidance.repository;

import com.careerguidance.entity.AdmissionEnquiry;
import com.careerguidance.entity.EnquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionEnquiryRepository extends JpaRepository<AdmissionEnquiry, Long> {

    /**
     * Check if a student already has a PENDING enquiry for the same program+counsellor.
     * Used for duplicate prevention.
     */
    boolean existsByStudentIdAndProgramIdAndCounsellorIdAndStatus(
            Long studentId, Long programId, Long counsellorId, EnquiryStatus status);

    List<AdmissionEnquiry> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
