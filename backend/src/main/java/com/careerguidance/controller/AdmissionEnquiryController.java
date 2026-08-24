package com.careerguidance.controller;

import com.careerguidance.dto.AdmissionEnquiryRequest;
import com.careerguidance.dto.AdmissionEnquiryResponseDto;
import com.careerguidance.dto.ApiResponse;
import com.careerguidance.service.AdmissionEnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admission-enquiries")
public class AdmissionEnquiryController {

    private final AdmissionEnquiryService enquiryService;

    public AdmissionEnquiryController(AdmissionEnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    /**
     * POST /api/admission-enquiries
     * Submit a new admission enquiry from a verified student.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AdmissionEnquiryResponseDto>> submitEnquiry(
            @Valid @RequestBody AdmissionEnquiryRequest request) {

        AdmissionEnquiryResponseDto response = enquiryService.submitEnquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Your admission enquiry has been submitted! Our team will contact you soon.",
                        response));
    }
}
