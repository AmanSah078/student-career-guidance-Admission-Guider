/**
 * Centralized API and Backend configuration
 */
export const isLocalEnvironment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (isLocalEnvironment
    ? 'http://localhost:8080/api'
    : 'https://student-career-guidance-admission-guider.onrender.com/api');

export const hasLiveBackend = Boolean(API_BASE_URL);

