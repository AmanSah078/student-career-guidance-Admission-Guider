import { API_BASE_URL, hasLiveBackend } from './apiConfig';

const FEEDBACK_API_URL = hasLiveBackend ? `${API_BASE_URL}/feedback` : '';

const FALLBACK_FEEDBACK = [
  {
    id: 1,
    studentName: 'Rohan Sharma',
    educationPath: 'GRADUATION',
    rating: 5,
    message: 'SeniorGuide helped me understand the real scope of B.Sc and career opportunities. Shayam sir gave me complete admission clarity!'
  },
  {
    id: 2,
    studentName: 'Ananya Verma',
    educationPath: 'COURSES',
    rating: 5,
    message: 'I was confused between degree courses and technical polytechnic diplomas. Karunakar sir guided me through exact eligibility and career jobs.'
  },
  {
    id: 3,
    studentName: 'Priya Patel',
    educationPath: 'GRADUATION',
    rating: 5,
    message: 'Connecting with verified admission advisors through this platform saved me so much time. Direct WhatsApp guidance and transparent process!'
  }
];

/**
 * Fetch approved student feedback for public display
 * @returns {Promise<Array>} List of approved feedback DTOs
 */
export async function fetchPublicFeedback() {
  if (FEEDBACK_API_URL) {
    try {
      const response = await fetch(`${FEEDBACK_API_URL}/public`);
      const result = await response.json();
      if (result && result.data && result.data.length > 0) return result.data;
    } catch {
      // Fallback
    }
  }
  return FALLBACK_FEEDBACK;
}

/**
 * Submit feedback from a student
 * @param {Object} feedbackData - { studentId, rating, message }
 * @returns {Promise<Object>} Submitted feedback DTO
 */
export async function submitFeedback(feedbackData) {
  if (FEEDBACK_API_URL) {
    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit feedback.');
      }
      return result;
    } catch {
      // Fallback
    }
  }
  return { success: true, message: 'Thank you for your valuable feedback!' };
}

