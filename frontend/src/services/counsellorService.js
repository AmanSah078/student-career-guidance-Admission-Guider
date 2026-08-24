import { API_BASE_URL, hasLiveBackend } from './apiConfig';

const COUNSELLORS_API_URL = hasLiveBackend ? `${API_BASE_URL}/counsellors` : '';

const OFFICIAL_ADVISORS = [
  {
    id: 1,
    name: 'Shayam Kumar Yadav',
    designation: 'Head of Admissions & Academic Guidance',
    profileImage: 'SY',
    experience: '7+ Years Experience',
    phone: '6205606097',
    email: 'syo209514@gmail.com',
    bio: 'Dedicated senior admission advisor guiding students across undergraduate degree programs (B.Sc, B.A, B.Ed), college stream selection, eligibility verification, and authentic career pathways.',
    handledProgramNames: ['B.Sc', 'B.A', 'B.Ed'],
    handledProgramIds: [1, 2, 3]
  },
  {
    id: 2,
    name: 'Karunakar Pandey',
    designation: 'Lead Technical & Vocational Admissions Advisor',
    profileImage: 'KP',
    experience: '8+ Years Experience',
    phone: '9576997103',
    email: 'golubabusiwan@gmail.com',
    bio: 'Specialist technical admission counselor guiding students in diploma engineering (Polytechnic), ITI vocational trade programs, elementary teacher education (D.El.Ed), and direct career opportunities.',
    handledProgramNames: ['Polytechnic', 'ITI', 'D.El.Ed'],
    handledProgramIds: [4, 5, 6]
  }
];

/**
 * Fetch admission team counsellors for selected program (or all counsellors if programId omitted)
 * @param {number|string} programId 
 */
export async function fetchCounsellors(programId = null) {
  if (COUNSELLORS_API_URL) {
    try {
      const url = programId ? `${COUNSELLORS_API_URL}?programId=${programId}` : COUNSELLORS_API_URL;
      const response = await fetch(url);
      const result = await response.json();
      if (result && result.data && result.data.length > 0) return result.data;
    } catch {
      // Fallback
    }
  }
  return OFFICIAL_ADVISORS;
}

/**
 * Fetch detailed counsellor profile by ID
 * @param {number|string} id 
 */
export async function fetchCounsellorById(id) {
  if (COUNSELLORS_API_URL) {
    try {
      const response = await fetch(`${COUNSELLORS_API_URL}/${id}`);
      const result = await response.json();
      if (result && result.data) return result.data;
    } catch {
      // Fallback
    }
  }
  const matched = OFFICIAL_ADVISORS.find((a) => String(a.id) === String(id));
  return matched || OFFICIAL_ADVISORS[0];
}


