package com.careerguidance.service;

import com.careerguidance.dto.AdmissionEnquiryRequest;
import com.careerguidance.dto.AdmissionEnquiryResponseDto;

public interface AdmissionEnquiryService {

    /**
     * Submit a new admission enquiry.
     * Validates student, program, counsellor and prevents duplicate PENDING enquiries.
     *
     * @param request validated enquiry request
     * @return DTO with enquiry confirmation details
     */
    AdmissionEnquiryResponseDto submitEnquiry(AdmissionEnquiryRequest request);
}
