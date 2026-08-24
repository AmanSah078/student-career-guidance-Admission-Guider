import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { loginStudent, requestPasswordReset } from '../../services/authService';
import '../../styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUnverified, setIsUnverified] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsUnverified(false);
    setIsWrongPassword(false);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await loginStudent({ email: email.trim(), password });
      window.location.hash = '#onboarding';
    } catch (err) {
      const errMsg = err.message || '';
      if (errMsg.includes('UNVERIFIED_ACCOUNT')) {
        setIsUnverified(true);
        setError('Your account is not verified yet. A verification OTP has been sent to your email.');
      } else if (errMsg.includes('WRONG_PASSWORD')) {
        setIsWrongPassword(true);
        setError('Incorrect password entered. Click "Reset Password via Email OTP" below to create a new password.');
      } else {
        setError(errMsg || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReset = async () => {
    if (!validateEmail(email)) {
      setError('Please enter your registered email address above first.');
      return;
    }
    setResetLoading(true);
    try {
      await requestPasswordReset({ email: email.trim() });
      window.location.hash = `#reset-password?email=${encodeURIComponent(email.trim())}`;
    } catch (err) {
      setError(err.message || 'Could not send reset OTP. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Navbar />

      <main className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-badge">Welcome back</span>
            <h1 className="auth-title">Student Login</h1>
            <p className="auth-subtitle">Login with your registered email and password to continue.</p>
          </div>

          {error && (
            <div className="alert-box alert-danger">
              <span>{error}</span>
            </div>
          )}

          {isUnverified && (
            <div style={{ marginBottom: '1.25rem' }}>
              <button
                type="button"
                className="auth-submit-btn"
                onClick={() => window.location.hash = `#verify-email?email=${encodeURIComponent(email.trim())}`}
              >
                Verify Account with OTP
              </button>
            </div>
          )}

          {isWrongPassword && (
            <div style={{ marginBottom: '1.25rem' }}>
              <button
                type="button"
                className="auth-submit-btn"
                disabled={resetLoading}
                onClick={handleQuickReset}
              >
                {resetLoading ? 'Sending Reset OTP...' : 'Reset Password via Email OTP'}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <button
              type="button"
              className="auth-submit-btn secondary-action-btn"
              onClick={handleQuickReset}
              disabled={resetLoading}
            >
              {resetLoading ? 'Sending Reset OTP...' : 'Forgot / Reset Password?'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
