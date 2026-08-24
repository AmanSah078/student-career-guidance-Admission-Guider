const API_BASE_URL = 'http://localhost:8080/api/students';

/**
 * Save education path choice for verified student
 * @param {number} studentId 
 * @param {string} educationPath - 'GRADUATION' | 'COURSES'
 */
export async function saveEducationPath(studentId, educationPath) {
  try {
    const response = await fetch(`${API_BASE_URL}/education-path`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId, educationPath }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to save education path choice.');
    }
    return result;
  } catch (error) {
    throw error;
  }
}
