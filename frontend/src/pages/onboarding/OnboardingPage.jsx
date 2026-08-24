import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { saveEducationPath } from '../../services/studentService';
import '../../styles/landing.css';
import '../../styles/onboarding.css';

export default function OnboardingPage({ studentId = null }) {
  const [selectedPath, setSelectedPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelect = (path) => {
    setSelectedPath(path);
    if (error) setError('');
  };

  const handleContinue = async () => {
    if (!selectedPath || !studentId) return;

    setLoading(true);
    setError('');

    try {
      await saveEducationPath(studentId, selectedPath);
      setSavedSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save choice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-wrapper">
      <Navbar />

      <main className="onboarding-container">
        <div className="onboarding-card">
          {!studentId ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <h2 className="onboarding-title">Verify Your Email First</h2>
              <p className="onboarding-subtitle" style={{ marginBottom: '1.5rem' }}>
                Create your student account and verify it with OTP before choosing an education path.
              </p>
              <button className="continue-btn" onClick={() => window.location.hash = '#register'}>
                Create Account
              </button>
            </div>
          ) : savedSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#58a6ff' }}>Saved</div>
              <h2 className="onboarding-title">Education Path Selected!</h2>
              <p className="onboarding-subtitle" style={{ marginBottom: '1.5rem' }}>
                You selected <strong style={{ color: '#58a6ff' }}>{selectedPath === 'GRADUATION' ? 'Graduation Degrees' : 'Technical & Vocational Courses'}</strong>.
              </p>
              <div className="alert-box alert-success" style={{ textAlign: 'left', maxWidth: '560px', margin: '0 auto 2rem auto' }}>
                <span>Your choice has been updated. You can now explore program roadmaps or connect directly with our specialized guidance team for personalized assistance!</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px', margin: '0 auto' }}>
                <button
                  className="continue-btn"
                  onClick={() => window.location.hash = `#programs?path=${selectedPath}`}
                >
                  Explore Programs for {selectedPath === 'GRADUATION' ? 'Graduation' : 'Courses'}
                </button>
                <button
                  className="continue-btn"
                  style={{ background: '#21262d', border: '1px solid #30363d' }}
                  onClick={() => window.location.hash = '#counsellors'}
                >
                  Connect with Admission Advisors Team
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="step-header">
                <span className="step-indicator">Choose Education Path</span>
                <h1 className="onboarding-title">Let's find the right path for you.</h1>
                <p className="onboarding-subtitle">
                  Choose what you are looking for and we will help you explore the options, future opportunities, and next steps.
                </p>
              </div>

              {error && (
                <div className="alert-box alert-danger" style={{ maxWidth: '540px', margin: '0 auto 1.5rem auto' }}>
                  <span>{error}</span>
                </div>
              )}

              <div className="paths-grid">
                <div
                  className={`path-card ${selectedPath === 'GRADUATION' ? 'selected' : ''}`}
                  onClick={() => handleSelect('GRADUATION')}
                >
                  {selectedPath === 'GRADUATION' && <div className="selected-badge">OK</div>}
                  <div className="path-icon">UG</div>
                  <h3 className="path-name">Graduation</h3>
                  <p className="path-desc">
                    Explore degree programs, their opportunities, syllabus, and future career paths.
                  </p>
                  <div className="path-examples">
                    <span className="example-tag">B.Sc</span>
                    <span className="example-tag">B.A</span>
                    <span className="example-tag">B.Ed</span>
                  </div>
                </div>

                <div
                  className={`path-card ${selectedPath === 'COURSES' ? 'selected' : ''}`}
                  onClick={() => handleSelect('COURSES')}
                >
                  {selectedPath === 'COURSES' && <div className="selected-badge">OK</div>}
                  <div className="path-icon">SK</div>
                  <h3 className="path-name">Courses</h3>
                  <p className="path-desc">
                    Explore technical, vocational, and skill-oriented certification programs.
                  </p>
                  <div className="path-examples">
                    <span className="example-tag">D.El.Ed</span>
                    <span className="example-tag">ITI</span>
                    <span className="example-tag">Polytechnic</span>
                  </div>
                </div>
              </div>

              <div className="onboarding-actions">
                <button
                  className="continue-btn"
                  disabled={!selectedPath || loading}
                  onClick={handleContinue}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Saving Selection...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
