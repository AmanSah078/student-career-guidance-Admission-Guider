const API_BASE_URL = 'http://localhost:8080/api/admission-enquiries';

/**
 * Submit an admission enquiry
 * @param {Object} payload - { studentId, programId, counsellorId, message }
 * @returns {Promise<Object>} - response DTO with enquiry confirmation
 */
export async function submitEnquiry(payload) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    // Surface the backend's friendly message directly
    throw new Error(result.message || "We couldn't submit your request right now. Please try again.");
  }

  return result.data;
}
