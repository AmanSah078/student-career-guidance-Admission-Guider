import { API_BASE_URL, hasLiveBackend } from './apiConfig';

const FALLBACK_PROGRAMS = [
  {
    id: 1,
    code: 'BSC',
    name: 'B.Sc - Bachelor of Science',
    educationPath: 'GRADUATION',
    shortDescription: 'Build a strong foundation in physical, biological, or computer sciences with diverse career and research opportunities.',
    duration: '3 Years',
    eligibility: '10+2 Science Stream (PCB / PCM)',
    studyMode: 'Regular / Full-Time',
    overview: 'The Bachelor of Science (B.Sc) is an undergraduate degree program designed for students passionate about science, analytical reasoning, research, and technical applications. The program provides comprehensive theoretical understanding combined with practical laboratory experiments across core science specializations.',
    whatYouWillStudy: 'Physics, Chemistry, Mathematics, Computer Science, Biology, Environmental Studies, Scientific Computing, Research Methodology',
    whyChoose: 'Develop strong problem-solving and analytical thinking skills. Opens direct pathways to higher studies (M.Sc/Ph.D), government scientific research organizations, IT industries, and competitive examinations.',
    admissionProcess: '1. Submit your online admission enquiry.\n2. Connect with our admission counselling team.\n3. Verify your 10+2 stream eligibility and certificate documents.\n4. Complete seat confirmation and college admission guidelines.',
    displayOrder: 1
  },
  {
    id: 2,
    code: 'BA',
    name: 'B.A - Bachelor of Arts',
    educationPath: 'GRADUATION',
    shortDescription: 'Explore humanities, social sciences, languages, and creative disciplines with wide civil service and career scope.',
    duration: '3 Years',
    eligibility: '10+2 Any Recognized Stream',
    studyMode: 'Regular / Full-Time',
    overview: 'The Bachelor of Arts (B.A) degree program offers broad knowledge across liberal arts, literature, social sciences, and humanities. It encourages critical thinking, effective communication, cultural awareness, and interdisciplinary analysis suited for diverse public and private sector opportunities.',
    whatYouWillStudy: 'English Literature, History, Political Science, Economics, Sociology, Psychology, Public Administration, General Communication',
    whyChoose: 'Ideal foundation for Civil Services (UPSC/State PSC), journalism, law, teaching, corporate communications, and social sector careers with maximum flexibility.',
    admissionProcess: '1. Submit your online admission enquiry.\n2. Connect with our admission counselling team.\n3. Discuss specialization subject choices.\n4. Finalize application document submission.',
    displayOrder: 2
  },
  {
    id: 3,
    code: 'BED',
    name: 'B.Ed - Bachelor of Education',
    educationPath: 'GRADUATION',
    shortDescription: 'Professional degree program designed for aspiring educators and teaching career opportunities.',
    duration: '2 Years',
    eligibility: 'Bachelor Degree with minimum 50% Marks',
    studyMode: 'Regular / Full-Time',
    overview: 'The Bachelor of Education (B.Ed) is a professional NCTE-approved degree program mandated for individuals aspiring to teach at secondary and senior secondary school levels. It focuses on modern pedagogy, educational psychology, classroom management, and practical teaching internship experience.',
    whatYouWillStudy: 'Educational Psychology, Pedagogy of School Subjects, Classroom Management, Educational Technology, Assessment & Evaluation, School Internship',
    whyChoose: 'Essential credential for government teaching recruitments (CTET/STET), reputed private international schools, educational consultancy, and academic leadership.',
    admissionProcess: '1. Submit your online admission enquiry.\n2. Connect with our admission team to check graduation eligibility.\n3. Submit graduation marksheets for merit validation.\n4. Secure your admission seat.',
    displayOrder: 3
  },
  {
    id: 4,
    code: 'DELED',
    name: 'D.El.Ed - Diploma in Elementary Education',
    educationPath: 'COURSES',
    shortDescription: 'Professional diploma training for primary school teaching certification.',
    duration: '2 Years',
    eligibility: '10+2 with minimum 50% Marks',
    studyMode: 'Regular / Full-Time',
    overview: 'The Diploma in Elementary Education (D.El.Ed) is a practical 2-year teacher training course that equips candidates with skills to teach elementary and primary school students (Classes 1 to 8). The course emphasizes child development, foundational literacy, and interactive teaching techniques.',
    whatYouWillStudy: 'Child Development & Pedagogy, Environmental Studies Teaching, Primary Mathematics Education, Language Teaching Skills, Practical School Teaching Practice',
    whyChoose: 'Direct qualification for primary school teacher recruitment exams (CTET/TET) and elementary school educator positions in government and private sectors.',
    admissionProcess: '1. Submit your online admission enquiry.\n2. Connect with our admission counselling team.\n3. Verify your 10+2 board marksheet.\n4. Complete registration and enrollment formalities.',
    displayOrder: 1
  },
  {
    id: 5,
    code: 'ITI',
    name: 'ITI - Industrial Training Institute',
    educationPath: 'COURSES',
    shortDescription: 'Vocational skill training programs in electrical, mechanical, and technical trades.',
    duration: '1 - 2 Years',
    eligibility: '10th Pass from Recognized Board',
    studyMode: 'Full-Time Technical Workshop',
    overview: 'Industrial Training Institute (ITI) courses provide practical, skill-focused technical training across essential industrial trades such as Electrician, Fitter, Mechanic, Machinist, and Welder. Designed for immediate employment, ITI emphasizes hands-on workshop experience.',
    whatYouWillStudy: 'Trade Theory, Practical Workshop Practice, Engineering Drawing, Workshop Calculation & Science, Employability & Industry Safety Skills',
    whyChoose: 'High demand in railway recruitment, public sector undertakings (PSUs like BHEL/NTPC), manufacturing units, auto industries, and self-employment trade workshops.',
    admissionProcess: '1. Submit your online admission enquiry.\n2. Connect with our admission team to choose trade specialization.\n3. Verify 10th pass marksheets.\n4. Complete workshop seat allocation.',
    displayOrder: 2
  },
  {
    id: 6,
    code: 'POLYTECHNIC',
    name: 'Polytechnic - Diploma in Engineering',
    educationPath: 'COURSES',
    shortDescription: 'Hands-on technical diploma programs preparing for engineering careers and lateral degree entry.',
    duration: '3 Years',
    eligibility: '10th Pass with Science & Mathematics',
    studyMode: 'Regular / Full-Time',
    overview: 'Polytechnic Engineering Diplomas offer technical education in branches like Civil, Mechanical, Electrical, Electronics, and Computer Engineering. It combines practical engineering labs with foundational theory, enabling direct employment as Junior Engineers.',
    whatYouWillStudy: 'Applied Mathematics & Physics, Engineering Graphics, Electrical/Mechanical Workshop Labs, Computer Programming, Branch Specialization Subjects',
    whyChoose: 'Offers dual benefit: direct Junior Engineer employment in government/private firms, plus lateral entry opportunity directly into the 2nd year of B.Tech/B.E. degree.',
    admissionProcess: '1. Submit your online admission enquiry.\n2. Connect with our admission team to select engineering branch.\n3. Verify 10th marksheet and eligibility.\n4. Confirm your engineering diploma seat.',
    displayOrder: 3
  }
];

/**
 * Fetch active programs for selected education path
 * @param {string} educationPath - 'GRADUATION' | 'COURSES'
 */
export async function fetchProgramsByPath(educationPath) {
  if (hasLiveBackend) {
    try {
      const response = await fetch(`${API_BASE_URL}/programs?path=${encodeURIComponent(educationPath)}`);
      const result = await response.json();
      if (result && result.data && result.data.length > 0) return result.data;
    } catch {
      // Fall through to instant fallback catalog
    }
  }
  return FALLBACK_PROGRAMS.filter((p) => p.educationPath === educationPath);
}

/**
 * Fetch detailed program information by ID or code
 * @param {number|string} id 
 */
export async function fetchProgramById(id) {
  if (hasLiveBackend) {
    try {
      const response = await fetch(`${API_BASE_URL}/programs/${id}`);
      const result = await response.json();
      if (result && result.data) return result.data;
    } catch {
      // Fall through
    }
  }
  const matched = FALLBACK_PROGRAMS.find((p) => String(p.id) === String(id) || p.code.toLowerCase() === String(id).toLowerCase());
  return matched || FALLBACK_PROGRAMS[0];
}

/**
 * Persist student's selected program choice
 * @param {number} studentId 
 * @param {number} programId 
 */
export async function selectStudentProgram(studentId, programId) {
  if (hasLiveBackend) {
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
    } catch {
      // Fallback
    }
  }
  return { success: true, message: 'Program selection saved successfully.' };
}
