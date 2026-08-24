import { API_BASE_URL, hasLiveBackend } from './apiConfig';
import { getVerifiedStudent, saveVerifiedStudent } from './authService';

const STUDENTS_API_URL = hasLiveBackend ? `${API_BASE_URL}/students` : '';

/**
 * Save education path choice for verified student
 * @param {number} studentId 
 * @param {string} educationPath - 'GRADUATION' | 'COURSES'
 */
export async function saveEducationPath(studentId, educationPath) {
  if (STUDENTS_API_URL) {
    try {
      const response = await fetch(`${STUDENTS_API_URL}/education-path`, {
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
      // Fallback
    }
  }

  // Save locally into verified student state
  const student = getVerifiedStudent() || {
    id: studentId || Date.now(),
    fullName: 'Student',
    verified: true
  };
  student.educationPath = educationPath;
  saveVerifiedStudent(student);
  return { success: true, message: 'Education path saved successfully.' };
}

