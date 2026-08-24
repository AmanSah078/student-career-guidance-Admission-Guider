const API_BASE_URL = 'http://localhost:8080/api/feedback';

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
    return result.data || [];
  } catch (error) {
    throw error;
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
  } catch (error) {
    throw error;
  }
}
