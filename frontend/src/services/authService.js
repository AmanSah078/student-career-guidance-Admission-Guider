const API_BASE_URL = 'http://localhost:8080/api/auth';
const VERIFIED_STUDENT_KEY = 'seniorguide_verified_student';

async function handleResponse(response) {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Request failed. Please try again.');
  }
  return result;
}

export async function registerStudent(registerData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
  });

  return handleResponse(response);
}

export async function loginStudent(loginData) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  const result = await handleResponse(response);
  if (result.data) {
    saveVerifiedStudent(result.data);
  }
  return result;
}

export async function requestPasswordReset(data) {
  const response = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function resetPassword(data) {
  const response = await fetch(`${API_BASE_URL}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse(response);
  if (result.data) {
    saveVerifiedStudent(result.data);
  }
  return result;
}

export async function verifyEmailOtp(email, otp) {
  const response = await fetch(`${API_BASE_URL}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  const result = await handleResponse(response);
  if (result.data) {
    saveVerifiedStudent(result.data);
  }

  return result;
}

export async function resendVerificationOtp(email) {
  const response = await fetch(`${API_BASE_URL}/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse(response);
}

export function saveVerifiedStudent(student) {
  if (!student || !student.id) return;
  localStorage.setItem(VERIFIED_STUDENT_KEY, JSON.stringify(student));
}

export function getVerifiedStudent() {
  try {
    const rawStudent = localStorage.getItem(VERIFIED_STUDENT_KEY);
    return rawStudent ? JSON.parse(rawStudent) : null;
  } catch {
    localStorage.removeItem(VERIFIED_STUDENT_KEY);
    return null;
  }
}

export function getVerifiedStudentId(fallbackId = 2) {
  const student = getVerifiedStudent();
  return student?.id || fallbackId;
}

export function clearVerifiedStudent() {
  localStorage.removeItem(VERIFIED_STUDENT_KEY);
}
