import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { requestPasswordReset } from '../../services/authService';
import '../../styles/auth.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Enter the email you used during registration.');
  const [error, setError] = useState('');

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordReset({ email: email.trim() });
      setMessage(res.message || 'Password reset instructions have been sent if the email is registered.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Unable to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Navbar />

      <main className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-badge">Password Reset</span>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">Enter your registered email and we’ll send you reset instructions.</p>
          </div>

          {error && (
            <div className="alert-box alert-danger">
              <span>{error}</span>
            </div>
          )}

          {message && !error && (
            <div className="alert-box alert-success">
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                className="form-input"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              className="auth-submit-btn secondary-action-btn"
              onClick={() => window.location.hash = '#login'}
            >
              Back to Login
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
