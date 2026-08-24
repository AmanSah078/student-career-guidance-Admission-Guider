import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { fetchProgramById } from '../../services/programService';
import { fetchCounsellorById } from '../../services/counsellorService';
import { submitEnquiry } from '../../services/enquiryService';
import { getVerifiedStudentId } from '../../services/authService';
import '../../styles/landing.css';
import '../../styles/counsellor.css';
import '../../styles/enquiry.css';

const MAX_MESSAGE = 1000;
const MIN_MESSAGE = 10;

function parseHashParams() {
  const hash = window.location.hash;
  const params = {};
  if (hash.includes('?')) {
    hash.split('?')[1].split('&').forEach((pair) => {
      const [k, v] = pair.split('=');
      if (k && v) params[k] = decodeURIComponent(v);
    });
  }
  return params;
}

export default function AdmissionEnquiryPage() {
  const params = parseHashParams();
  const counsellorId = params.counsellorId || null;
  const programId = params.programId || null;
  const studentId = params.studentId || getVerifiedStudentId(null);

  const [program, setProgram] = useState(null);
  const [counsellor, setCounsellor] = useState(null);
  const [loadingCtx, setLoadingCtx] = useState(true);
  const [ctxError, setCtxError] = useState('');

  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadCtx = async () => {
      setLoadingCtx(true);
      setCtxError('');
      try {
        const [prog, couns] = await Promise.all([
          programId ? fetchProgramById(programId) : Promise.resolve(null),
          counsellorId ? fetchCounsellorById(counsellorId) : Promise.resolve(null),
        ]);
        setProgram(prog);
        setCounsellor(couns);
      } catch {
        setCtxError('Could not load your selection details. Please go back and try again.');
      } finally {
        setLoadingCtx(false);
      }
    };
    loadCtx();
  }, [programId, counsellorId]);

  const validateMessage = (value) => {
    if (!value.trim()) return 'Please write a message or question for our admission team.';
    if (value.trim().length < MIN_MESSAGE) return `Your message should be at least ${MIN_MESSAGE} characters.`;
    if (value.length > MAX_MESSAGE) return `Your message cannot exceed ${MAX_MESSAGE} characters.`;
    return '';
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (messageError) setMessageError(validateMessage(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const msgErr = validateMessage(message);
    if (msgErr) {
      setMessageError(msgErr);
      return;
    }

    if (!studentId) {
      setSubmitError('Please create and verify your account before submitting an enquiry.');
      return;
    }

    if (!programId || !counsellorId) {
      setSubmitError('Missing program or counsellor selection. Please go back and choose again.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitEnquiry({
        studentId: Number(studentId),
        programId: Number(programId),
        counsellorId: Number(counsellorId),
        message: message.trim(),
      });
      setSuccess(result);
    } catch (err) {
      setSubmitError(err.message || "We couldn't submit your request right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="enquiry-success-wrapper">
        <Navbar />
        <div className="enquiry-success-container">
          <div className="success-card">
            <div className="success-icon-circle">OK</div>

            <h1 className="success-title">Your Request Has Been Received</h1>
            <p className="success-subtitle">
              Our admission team will review your enquiry and get in touch with you shortly.
              Thank you for trusting SeniorGuide.
            </p>

            <div className="success-details-grid">
              <div className="success-detail-item">
                <span className="success-detail-label">Program</span>
                <span className="success-detail-value">{success.programName || program?.name || '-'}</span>
              </div>
              <div className="success-detail-item">
                <span className="success-detail-label">Advisor</span>
                <span className="success-detail-value">{success.counsellorName || counsellor?.name || '-'}</span>
              </div>
              <div className="success-detail-item">
                <span className="success-detail-label">Role</span>
                <span className="success-detail-value">{success.counsellorDesignation || counsellor?.designation || '-'}</span>
              </div>
              <div className="success-detail-item">
                <span className="success-detail-label">Status</span>
                <span className="success-status-pill">Request Received</span>
              </div>
            </div>

            <div className="success-actions">
              <button
                className="success-primary-btn"
                onClick={() => window.location.hash = `#program-details?id=${programId}`}
              >
                Back to Program
              </button>
              <button
                className="success-secondary-btn"
                onClick={() => window.location.hash = '#programs'}
              >
                Explore More Programs
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loadingCtx) {
    return (
      <div className="enquiry-wrapper">
        <Navbar />
        <div className="enquiry-container">
          <div className="enquiry-skeleton-card" style={{ height: '120px', marginBottom: '1.5rem' }} />
          <div className="enquiry-skeleton-card" style={{ height: '300px' }} />
        </div>
        <Footer />
      </div>
    );
  }

  if (ctxError) {
    return (
      <div className="enquiry-wrapper">
        <Navbar />
        <div className="enquiry-container">
          <div className="empty-catalog-box">
            <div className="empty-icon">Error</div>
            <h3 style={{ color: '#f85149', marginBottom: '0.5rem' }}>Something went wrong</h3>
            <p style={{ color: '#8b949e', marginBottom: '1.5rem' }}>{ctxError}</p>
            <button
              className="program-cta-btn"
              style={{ width: 'auto', margin: '0 auto' }}
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const charCount = message.length;
  const warnChars = charCount > MAX_MESSAGE * 0.85;

  return (
    <div className="enquiry-wrapper">
      <Navbar />

      <main className="enquiry-container">
        <div className="enquiry-header">
          <span className="enquiry-step-badge">Admission Enquiry</span>
          <h1 className="enquiry-title">Connect for Admission</h1>
          <p className="enquiry-subtitle">
            Send your question or message to our admission advisor. We will get back to you personally.
          </p>
        </div>

        {!studentId && (
          <div className="enquiry-error-alert">
            <span>Please create and verify your student account before submitting an admission enquiry.</span>
          </div>
        )}

        <div className="enquiry-context-card">
          <div className="context-card-title">Your Selection Summary</div>
          <div className="context-grid">
            {program && (
              <div className="context-item">
                <span className="context-label">Program</span>
                <span className="context-value">{program.name}</span>
              </div>
            )}
            {counsellor && (
              <div className="context-item">
                <span className="context-label">Your Advisor</span>
                <span className="context-value">{counsellor.name}</span>
              </div>
            )}
            {counsellor?.designation && (
              <div className="context-item">
                <span className="context-label">Role</span>
                <span className="context-value">{counsellor.designation}</span>
              </div>
            )}
            {program?.educationPath && (
              <div className="context-item">
                <span className="context-label">Education Path</span>
                <span className="context-value">
                  {program.educationPath === 'GRADUATION' ? 'Graduation' : 'Course'}
                </span>
              </div>
            )}
          </div>
        </div>

        <form className="enquiry-form-card" onSubmit={handleSubmit} noValidate>
          {submitError && (
            <div className="enquiry-error-alert">
              <span>{submitError}</span>
            </div>
          )}

          <div className="enquiry-field">
            <label htmlFor="enquiry-message">
              Your Message or Question <span className="required">*</span>
            </label>
            <textarea
              id="enquiry-message"
              className={`enquiry-textarea${messageError ? ' error-field' : ''}`}
              placeholder="e.g. I completed my 10+2 in Science stream and I am interested in B.Sc. Could you please guide me through the admission process and eligibility requirements?"
              value={message}
              onChange={handleMessageChange}
              onBlur={() => setMessageError(validateMessage(message))}
              maxLength={MAX_MESSAGE + 50}
              disabled={submitting || !studentId}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {messageError
                ? <span className="field-error">{messageError}</span>
                : <span />
              }
              <span className={`char-counter${warnChars ? ' warn' : ''}`}>
                {charCount} / {MAX_MESSAGE}
              </span>
            </div>
          </div>

          <button
            type="submit"
            id="enquiry-submit-btn"
            className="enquiry-submit-btn"
            disabled={submitting || !studentId}
          >
            {submitting ? (
              <>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                Submitting...
              </>
            ) : (
              'Submit My Admission Enquiry'
            )}
          </button>

          {!studentId && (
            <button
              type="button"
              className="enquiry-submit-btn"
              style={{ marginTop: '0.85rem', background: '#21262d', border: '1px solid #30363d' }}
              onClick={() => window.location.hash = '#register'}
            >
              Create and Verify Account
            </button>
          )}
        </form>
      </main>

      <Footer />
    </div>
  );
}
