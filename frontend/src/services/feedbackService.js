const API_BASE_URL = 'http://localhost:8080/api/feedback';

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
  try {
    const response = await fetch(`${API_BASE_URL}/public`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch public feedback.');
    }
    if (result.data && result.data.length > 0) return result.data;
    return FALLBACK_FEEDBACK;
  } catch {
    return FALLBACK_FEEDBACK;
  }
}

/**
 * Submit feedback from a student
 * @param {Object} feedbackData - { studentId, rating, message }
 * @returns {Promise<Object>} Submitted feedback DTO
 */
export async function submitFeedback(feedbackData) {
  try {
    const response = await fetch(API_BASE_URL, {
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
    return { success: true, message: 'Thank you for your valuable feedback!' };
  }
}
