import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { resendVerificationOtp, verifyEmailOtp } from '../../services/authService';
import '../../styles/landing.css';
import '../../styles/auth.css';

function getInitialEmail() {
  const hash = window.location.hash;
  const query = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  const hashParams = new URLSearchParams(query);
  const searchParams = new URLSearchParams(window.location.search);
  return hashParams.get('email') || searchParams.get('email') || '';
}

export default function VerifyEmailPage() {
  const [email, setEmail] = useState(getInitialEmail());
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('Enter the OTP sent to your email address or phone.');
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
      setFormError('Please enter the six-digit OTP from your email or SMS.');
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
      setMessage(res.message || 'A new OTP has been sent to your email address and phone.');
      setOtp('');
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
                <h2 className="auth-title">Account Verified</h2>
                <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
                  {message}
                </p>
                <div className="alert-box alert-success" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                  <span>Your student account is verified. The app will now use your account for onboarding, program selection, feedback, and admission enquiries.</span>
                </div>
                <button
                  className="auth-submit-btn"
                  onClick={() => window.location.hash = '#onboarding'}
                >
                  Continue to Onboarding
                </button>
              </>
            ) : (
              <>
                <div className="auth-header">
                  <span className="auth-badge">📱 OTP Verification</span>
                  <h1 className="auth-title">Verify Your Student Account</h1>
                  <p className="auth-subtitle">{message}</p>
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
                      'Verify Account'
                    )}
                  </button>

                  <button
                    type="button"
                    className="auth-submit-btn secondary-action-btn"
                    disabled={resendLoading}
                    onClick={handleResend}
                  >
                    {resendLoading ? 'Sending OTP...' : 'Resend OTP'}
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
