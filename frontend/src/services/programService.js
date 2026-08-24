const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Fetch active programs for selected education path
 * @param {string} educationPath - 'GRADUATION' | 'COURSES'
 */
export async function fetchProgramsByPath(educationPath) {
  try {
    const response = await fetch(`${API_BASE_URL}/programs?path=${encodeURIComponent(educationPath)}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to load programs catalog.');
    }
    return result.data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch detailed program information by ID
 * @param {number} id 
 */
export async function fetchProgramById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/programs/${id}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to load program details.');
    }
    return result.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Persist student's selected program choice
 * @param {number} studentId 
 * @param {number} programId 
 */
export async function selectStudentProgram(studentId, programId) {
  try {
    const response = await fetch(`${API_BASE_URL}/students/select-program`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId, programId }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to save program selection.');
    }
    return result;
  } catch (error) {
    throw error;
  }
}
