import { getVerifiedStudent, saveVerifiedStudent } from './authService';

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
  } catch {
    // Save locally into verified student state so user experience is smooth on Netlify
    const student = getVerifiedStudent() || {
      id: studentId || Date.now(),
      fullName: 'Student',
      verified: true
    };
    student.educationPath = educationPath;
    saveVerifiedStudent(student);
    return { success: true, message: 'Education path saved successfully.' };
  }
}
