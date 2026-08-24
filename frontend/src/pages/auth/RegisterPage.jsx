import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { registerStudent } from '../../services/authService';
import '../../styles/landing.css';
import '../../styles/auth.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [developmentOtp, setDevelopmentOtp] = useState('');

  // Password Requirements Logic
  const requirements = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[@$!%*?&#]/.test(formData.password)
  };

  const metCount = Object.values(requirements).filter(Boolean).length;

  let strengthLabel = 'Weak';
  let strengthClass = 'strength-weak';
  let strengthPercent = 20;

  if (metCount >= 5) {
    strengthLabel = 'Strong';
    strengthClass = 'strength-strong';
    strengthPercent = 100;
  } else if (metCount >= 3) {
    strengthLabel = 'Medium';
    strengthClass = 'strength-medium';
    strengthPercent = 60;
  } else if (metCount > 0) {
    strengthPercent = Math.max(20, metCount * 20);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear specific field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (metCount < 5) {
      newErrors.password = 'Password must meet all complexity requirements.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    setDevelopmentOtp('');

    try {
      const response = await registerStudent(formData);
      setRegisteredSuccess(true);
      if (response.data?.verificationOtp) {
        setDevelopmentOtp(response.data.verificationOtp);
      }
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Navbar />

      <main className="auth-container">
        <div className="auth-card">
          {registeredSuccess ? (
            <div className="verify-status-box">
              <div className="verify-icon">📩</div>
              <h2 className="auth-title">Verify Your Account</h2>
              <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
                We sent a six-digit OTP to <strong style={{ color: '#58a6ff' }}>{formData.email}</strong> and your phone number.
              </p>
              <div className="alert-box alert-success" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <span>Account created successfully! For instant testing & access, your verification code is below:</span>
              </div>

              <div style={{ background: '#0d1117', border: '1px solid #238636', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                  Your Verification OTP
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '6px', color: '#3fb950' }}>
                  {developmentOtp || '123456'}
                </div>
              </div>

              <button 
                className="auth-submit-btn" 
                onClick={() => window.location.hash = `#verify-email?email=${encodeURIComponent(formData.email.trim())}&otp=${developmentOtp || '123456'}`}
              >
                Proceed to Verify Account
              </button>
              <button 
                className="auth-submit-btn" 
                style={{ marginTop: '1.5rem', background: '#21262d', border: '1px solid #30363d' }}
                onClick={() => window.location.hash = '#landing'}
              >
                Return to Home
              </button>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <span className="auth-badge">Verified Student Account</span>
                <h1 className="auth-title">Create Student Account</h1>
                <p className="auth-subtitle">Join SeniorGuide to unlock personalized education pathways and genuine counseling support.</p>
              </div>

              {apiError && (
                <div className="alert-box alert-danger">
                  <span>{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Personal Information */}
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <div className="input-wrapper">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className={`form-input ${errors.fullName ? 'has-error' : ''}`}
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.fullName && <div className="field-error">{errors.fullName}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-input ${errors.email ? 'has-error' : ''}`}
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <div className="input-wrapper">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={`form-input ${errors.phone ? 'has-error' : ''}`}
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phone && <div className="field-error">{errors.phone}</div>}
                </div>

                {/* Password Section */}
                <div className="form-group">
                  <label className="form-label" htmlFor="password">Create Password</label>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input ${errors.password ? 'has-error' : ''}`}
                      placeholder="Enter a strong password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && <div className="field-error">{errors.password}</div>}

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="strength-section">
                      <div className="strength-header">
                        <span>Password strength:</span>
                        <span className={strengthClass}>{strengthLabel}</span>
                      </div>
                      <div className="strength-bar-track">
                        <div
                          className={`strength-bar-fill ${strengthClass}`}
                          style={{ width: `${strengthPercent}%` }}
                        />
                      </div>
                      <ul className="requirements-list">
                        <li className={`req-item ${requirements.length ? 'met' : 'unmet'}`}>
                          {requirements.length ? 'Done' : 'Need'} 8+ characters
                        </li>
                        <li className={`req-item ${requirements.upper ? 'met' : 'unmet'}`}>
                          {requirements.upper ? 'Done' : 'Need'} Uppercase letter
                        </li>
                        <li className={`req-item ${requirements.lower ? 'met' : 'unmet'}`}>
                          {requirements.lower ? 'Done' : 'Need'} Lowercase letter
                        </li>
                        <li className={`req-item ${requirements.number ? 'met' : 'unmet'}`}>
                          {requirements.number ? 'Done' : 'Need'} Number
                        </li>
                        <li className={`req-item ${requirements.special ? 'met' : 'unmet'}`}>
                          {requirements.special ? 'Done' : 'Need'} Special character (@$!%*?&#)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`form-input ${errors.confirmPassword ? 'has-error' : ''}`}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <div style={{ fontSize: '0.8rem', color: '#3fb950', marginTop: '0.3rem' }}>
                      Passwords match
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
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
