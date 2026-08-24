import React, { useEffect, useState } from 'react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import { fetchPublicFeedback, submitFeedback } from '../../services/feedbackService';
import { getVerifiedStudentId } from '../../services/authService';

export default function StudentFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const data = await fetchPublicFeedback();
      setFeedbacks(data);
    } catch {
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    if (!getVerifiedStudentId(null)) {
      window.location.hash = '#register';
      return;
    }

    setShowModal(true);
    setSubmitSuccess(false);
    setFormError('');
    setMessage('');
    setRating(5);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!message.trim() || message.trim().length < 10) {
      setFormError('Please enter a feedback message of at least 10 characters.');
      return;
    }

    if (message.length > 1000) {
      setFormError('Feedback message cannot exceed 1000 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({
        studentId: getVerifiedStudentId(null),
        rating,
        message: message.trim(),
      });
      setSubmitSuccess(true);
      loadFeedback();
    } catch (err) {
      setFormError(err.message || 'Could not submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <section id="feedback" className="landing-section">
      <div className="container">
        <SectionHeading
          badge="Authentic Student Voice"
          title="What Students Say About Our Guidance"
          subtitle="Real, verified experiences from students who received genuine admission guidance and direction."
        />

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Button variant="primary" onClick={handleOpenModal}>
            Share Your Experience
          </Button>
        </div>

        {loading ? (
          <div className="feedback-grid">
            <div className="feedback-card" style={{ opacity: 0.6 }}>Loading student feedback...</div>
            <div className="feedback-card" style={{ opacity: 0.6 }}>Loading student feedback...</div>
            <div className="feedback-card" style={{ opacity: 0.6 }}>Loading student feedback...</div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-catalog-box" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#8b949e', marginBottom: '1rem' }}>No student feedback published yet.</p>
            <Button variant="outline" onClick={handleOpenModal}>
              Be the first to share feedback
            </Button>
          </div>
        ) : (
          <div className="feedback-grid">
            {feedbacks.map((item) => (
              <div key={item.id} className="feedback-card">
                <div style={{ color: '#e3b341', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Rating: {item.rating}/5
                </div>
                <p className="feedback-text">"{item.message}"</p>

                <div className="student-info">
                  <div className="student-avatar">{getInitials(item.studentName)}</div>
                  <div>
                    <div className="student-name">{item.studentName}</div>
                    <div className="student-context" style={{ fontSize: '0.8rem', color: '#6e7681' }}>
                      {item.programName || item.educationPath || 'Verified Student'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>X</button>

            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#2da44e' }}>
                  Feedback received
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: '#2da44e' }}>
                  Thank You for Your Feedback!
                </h3>
                <p style={{ color: '#57606a', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Your genuine feedback has been received. Our team will review it before publishing it publicly on the platform.
                </p>
                <Button variant="primary" onClick={handleCloseModal}>
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1f2328' }}>
                  Share Your Guidance Experience
                </h3>
                <p style={{ color: '#57606a', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Your honest feedback helps future students choose their educational path with confidence.
                </p>

                {formError && (
                  <div className="alert-box alert-danger" style={{ marginBottom: '1rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: '#ffebe9', border: '1px solid #ff8182', color: '#cf222e', fontSize: '0.88rem' }}>
                    {formError}
                  </div>
                )}

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.4rem', color: '#24292f' }}>
                    Overall Experience Rating <span style={{ color: '#cf222e' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        type="button"
                        key={score}
                        className={`rating-choice ${score <= (hoverRating || rating) ? 'selected' : ''}`}
                        onMouseEnter={() => setHoverRating(score)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(score)}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.4rem', color: '#24292f' }}>
                    Your Feedback <span style={{ color: '#cf222e' }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us how SeniorGuide helped you understand your options and connect for admission..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #d0d7de',
                      fontSize: '0.92rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                    disabled={submitting}
                  />
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#57606a', marginTop: '0.25rem' }}>
                    {message.length}/1000 characters
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <Button variant="outline" onClick={handleCloseModal} type="button" disabled={submitting}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
