import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { resendVerificationOtp, verifyEmailOtp } from '../../services/authService';
import '../../styles/landing.css';
import '../../styles/auth.css';

function getInitialParams() {
  const hash = window.location.hash;
  const query = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  const hashParams = new URLSearchParams(query);
  const searchParams = new URLSearchParams(window.location.search);
  return {
    email: hashParams.get('email') || searchParams.get('email') || '',
    otp: hashParams.get('otp') || searchParams.get('otp') || ''
  };
}

export default function VerifyEmailPage() {
  const initial = getInitialParams();
  const [email, setEmail] = useState(initial.email);
  const [otp, setOtp] = useState(initial.otp || '123456');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('Enter your 6-digit verification OTP below:');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleVerify = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateEmail(email)) {
      setFormError('Please enter your registered email address.');
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setFormError('Please enter the six-digit OTP.');
      return;
    }

    setVerifyLoading(true);
    try {
      const res = await verifyEmailOtp(email.trim(), otp.trim());
      setStatus('success');
      setMessage(res.message || 'Your account has been verified successfully.');
    } catch (err) {
      setStatus('idle');
      setFormError(err.message || 'Verification failed. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    setFormError('');

    if (!validateEmail(email)) {
      setFormError('Please enter your registered email address before requesting a new OTP.');
      return;
    }

    setResendLoading(true);
    try {
      const res = await resendVerificationOtp(email.trim());
      setMessage(res.message || 'Your verification OTP is 123456.');
      setOtp('123456');
    } catch (err) {
      setFormError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Navbar />

      <main className="auth-container">
        <div className="auth-card">
          <div className="verify-status-box">
            {status === 'success' ? (
              <>
                <div className="verify-icon">✅</div>
                <h2 className="auth-title">Account Verified!</h2>
                <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
                  {message}
                </p>
                <div className="alert-box alert-success" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                  <span>Your student account is now active. You can now explore programs, connect with admission advisors, and submit your application.</span>
                </div>
                <button
                  className="auth-submit-btn"
                  onClick={() => window.location.hash = '#onboarding'}
                >
                  Continue to Onboarding & Programs
                </button>
              </>
            ) : (
              <>
                <div className="auth-header">
                  <span className="auth-badge">📱 OTP Verification</span>
                  <h1 className="auth-title">Verify Your Student Account</h1>
                  <p className="auth-subtitle">{message}</p>
                </div>

                {/* Instant OTP helper pill */}
                <div style={{ background: 'rgba(35, 134, 54, 0.15)', border: '1px solid #238636', borderRadius: '10px', padding: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', color: '#c9d1d9' }}>
                    Instant Demo OTP: <strong style={{ color: '#3fb950', fontSize: '1.1rem', letterSpacing: '2px' }}>123456</strong>
                  </span>
                  <button
                    type="button"
                    style={{ background: '#238636', border: 'none', color: '#fff', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => setOtp('123456')}
                  >
                    Auto-Fill
                  </button>
                </div>

                {formError && (
                  <div className="alert-box alert-danger">
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleVerify} noValidate>
                  <div className="form-group">
                    <label className="form-label" htmlFor="verify-email">Email Address</label>
                    <input
                      id="verify-email"
                      type="email"
                      className="form-input"
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="verify-otp">Six-Digit OTP</label>
                    <input
                      id="verify-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      className="form-input otp-input"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>

                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? (
                      <>
                        <div className="spinner"></div>
                        Verifying...
                      </>
                    ) : (
                      'Verify Account & Continue'
                    )}
                  </button>

                  <button
                    type="button"
                    className="auth-submit-btn secondary-action-btn"
                    disabled={resendLoading}
                    onClick={handleResend}
                  >
                    {resendLoading ? 'Generating OTP...' : 'Get New OTP'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
