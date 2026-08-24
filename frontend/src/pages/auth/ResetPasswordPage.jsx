import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { resetPassword } from '../../services/authService';
import '../../styles/auth.css';

function getInitialParams() {
  const hash = window.location.hash;
  const query = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  return new URLSearchParams(query);
}

export default function ResetPasswordPage() {
  const params = getInitialParams();
  const [email, setEmail] = useState(params.get('email') || '');
  const [token, setToken] = useState(params.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('Enter the 6-digit OTP sent to your email and set your new password.');
  const [error, setError] = useState('');

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!token.trim()) {
      setError('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    if (!password || password.length < 8) {
      setError('Please enter a valid password with at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ email: email.trim(), token: token.trim(), password, confirmPassword });
      setIsSuccess(true);
      setMessage(res.message || 'Your password has been reset successfully. Your account is active.');
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to reset password. Please verify your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Navbar />

      <main className="auth-container">
        <div className="auth-card">
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
              <h2 className="auth-title">Password Reset Successful</h2>
              <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
                Your password has been updated and your account is verified.
              </p>
              <div className="alert-box alert-success" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <span>You can now choose your education path to connect with our guidance team.</span>
              </div>
              <button
                className="auth-submit-btn"
                onClick={() => window.location.hash = '#onboarding'}
              >
                Choose Your Education Path
              </button>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <span className="auth-badge">🔑 Reset Password</span>
                <h1 className="auth-title">Set New Password</h1>
                <p className="auth-subtitle">{message}</p>
              </div>

              {error && (
                <div className="alert-box alert-danger">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="reset-email">Email Address</label>
                  <input
                    id="reset-email"
                    type="email"
                    className="form-input"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reset-token">6-Digit OTP Code</label>
                  <input
                    id="reset-token"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="form-input otp-input"
                    placeholder="123456"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reset-password">New Password</label>
                  <div className="input-wrapper">
                    <input
                      id="reset-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Enter a new password"
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

                <div className="form-group">
                  <label className="form-label" htmlFor="reset-confirm-password">Confirm New Password</label>
                  <div className="input-wrapper">
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Updating Password...' : 'Reset Password & Continue'}
                </button>

                <button
                  type="button"
                  className="auth-submit-btn secondary-action-btn"
                  onClick={() => window.location.hash = '#login'}
                >
                  Back to Login
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
