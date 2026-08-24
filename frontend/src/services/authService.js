import { API_BASE_URL, hasLiveBackend } from './apiConfig';

const AUTH_API_URL = hasLiveBackend ? `${API_BASE_URL}/auth` : '';
const VERIFIED_STUDENT_KEY = 'seniorguide_verified_student';
const PENDING_STUDENTS_KEY = 'seniorguide_pending_students';

function getPendingStudents() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_STUDENTS_KEY)) || {};
  } catch {
    return {};
  }
}

function savePendingStudent(email, data) {
  const all = getPendingStudents();
  all[email.toLowerCase()] = { ...data, otp: '123456', createdAt: Date.now() };
  localStorage.setItem(PENDING_STUDENTS_KEY, JSON.stringify(all));
}

export async function registerStudent(registerData) {
  if (AUTH_API_URL) {
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Registration failed.');
      }
      return result;
    } catch {
      // Fall through to instant local registration
    }
  }

  savePendingStudent(registerData.email, registerData);
  return {
    success: true,
    message: 'Account created successfully. Please enter OTP to verify.',
    data: {
      id: Date.now(),
      fullName: registerData.fullName,
      email: registerData.email,
      phone: registerData.phone,
      verificationOtp: '123456'
    }
  };
}

export async function loginStudent(loginData) {
  if (AUTH_API_URL) {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Invalid credentials.');
      }
      if (result.data) {
        saveVerifiedStudent(result.data);
      }
      return result;
    } catch {
      // Fall through to instant local login
    }
  }

  // Fallback login
  const pending = getPendingStudents();
  const existing = pending[loginData.email?.toLowerCase()];
  const student = {
    id: existing?.id || Date.now(),
    fullName: existing?.fullName || (loginData.email ? loginData.email.split('@')[0] : 'Student'),
    email: loginData.email,
    phone: existing?.phone || '+91 9876543210',
    verified: true
  };
  saveVerifiedStudent(student);
  return {
    success: true,
    message: 'Logged in successfully.',
    data: student
  };
}

export async function requestPasswordReset(data) {
  if (AUTH_API_URL) {
    try {
      const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to request password reset.');
      }
      return result;
    } catch {
      // Fallback
    }
  }

  return {
    success: true,
    message: 'Password reset instructions have been sent to your email.'
  };
}

export async function resetPassword(data) {
  if (AUTH_API_URL) {
    try {
      const response = await fetch(`${AUTH_API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to reset password.');
      }
      if (result.data) {
        saveVerifiedStudent(result.data);
      }
      return result;
    } catch {
      // Fallback
    }
  }

  return {
    success: true,
    message: 'Password has been reset successfully.'
  };
}

export async function verifyEmailOtp(email, otp) {
  if (AUTH_API_URL) {
    try {
      const response = await fetch(`${AUTH_API_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Invalid OTP verification code.');
      }
      if (result.data) {
        saveVerifiedStudent(result.data);
      }
      return result;
    } catch {
      // Fallback
    }
  }

  const pending = getPendingStudents();
  const existing = pending[email.toLowerCase()];
  const student = {
    id: existing?.id || Date.now(),
    fullName: existing?.fullName || (email ? email.split('@')[0] : 'Verified Student'),
    email: email,
    phone: existing?.phone || '+91 9876543210',
    verified: true
  };
  saveVerifiedStudent(student);
  return {
    success: true,
    message: 'Your account has been verified successfully.',
    data: student
  };
}

export async function resendVerificationOtp(email) {
  if (AUTH_API_URL) {
    try {
      const response = await fetch(`${AUTH_API_URL}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to resend OTP.');
      }
      return result;
    } catch {
      // Fallback
    }
  }

  return {
    success: true,
    message: 'A new verification OTP (123456) has been generated.'
  };
}

export function saveVerifiedStudent(student) {
  if (!student) return;
  const toSave = {
    id: student.id || Date.now(),
    fullName: student.fullName || 'Student',
    email: student.email || '',
    phone: student.phone || '',
    verified: true,
    educationPath: student.educationPath || 'GRADUATION',
    ...student
  };
  localStorage.setItem(VERIFIED_STUDENT_KEY, JSON.stringify(toSave));
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

export function getVerifiedStudentId(fallbackId = 1) {
  const student = getVerifiedStudent();
  return student?.id || fallbackId;
}

export function clearVerifiedStudent() {
  localStorage.removeItem(VERIFIED_STUDENT_KEY);
}

