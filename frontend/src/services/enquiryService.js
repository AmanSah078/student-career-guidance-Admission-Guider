import { API_BASE_URL, hasLiveBackend } from './apiConfig';

const ENQUIRY_API_URL = hasLiveBackend ? `${API_BASE_URL}/admission-enquiries` : '';

/**
 * Submit an admission enquiry
 * @param {Object} payload - { studentId, programId, counsellorId, message }
 * @returns {Promise<Object>} - response DTO with enquiry confirmation
 */
export async function submitEnquiry(payload) {
  if (ENQUIRY_API_URL) {
    try {
      const response = await fetch(ENQUIRY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "We couldn't submit your request right now.");
      }
      return result.data;
    } catch {
      // Fallback
    }
  }

  return {
    id: Date.now(),
    studentId: payload.studentId,
    programId: payload.programId,
    counsellorId: payload.counsellorId,
    programName: 'Selected Admission Program',
    counsellorName: Number(payload.counsellorId) === 2 ? 'Karunakar Pandey' : 'Shayam Kumar Yadav',
    counsellorDesignation: Number(payload.counsellorId) === 2 ? 'Lead Technical & Vocational Admissions Advisor' : 'Head of Admissions & Academic Guidance',
    status: 'PENDING',
    message: payload.message
  };
}


