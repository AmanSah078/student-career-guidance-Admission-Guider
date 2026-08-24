import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { fetchProgramById } from '../../services/programService';
import '../../styles/landing.css';
import '../../styles/program.css';
import '../../styles/program-detail.css';

export default function ProgramDetailPage({ programId: propProgramId }) {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let id = propProgramId;
    if (!id) {
      const hash = window.location.hash;
      if (hash.includes('id=')) {
        id = hash.split('id=')[1].split('&')[0];
      }
    }

    if (!id) {
      setError('No program ID specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    fetchProgramById(id)
      .then((data) => {
        setProgram(data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load program details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [propProgramId]);

  const handleConnectAdmission = () => {
    window.location.hash = `#counsellors?programId=${program?.id || ''}`;
  };

  if (loading) {
    return (
      <div className="detail-wrapper">
        <Navbar />
        <main className="detail-container" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
          <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem auto' }}></div>
          <h2 style={{ color: '#f0f6fc' }}>Loading Program Information...</h2>
          <p style={{ color: '#8b949e' }}>Fetching verified database details from Spring Boot backend...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="detail-wrapper">
        <Navbar />
        <main className="detail-container">
          <div className="empty-catalog-box">
            <div className="empty-icon">Error</div>
            <h2 style={{ color: '#f85149', marginBottom: '0.75rem' }}>Program Not Found</h2>
            <p style={{ color: '#8b949e', marginBottom: '1.5rem' }}>{error || 'The requested program information is not available.'}</p>
            <button
              className="program-cta-btn"
              style={{ width: 'auto', padding: '0.75rem 1.5rem', margin: '0 auto' }}
              onClick={() => window.location.hash = '#programs'}
            >
              Return to Program Catalog
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isGraduation = program.educationPath === 'GRADUATION';
  const studyItems = program.whatYouWillStudy ? program.whatYouWillStudy.split(',').map((s) => s.trim()) : [];
  const admissionSteps = program.admissionProcess ? program.admissionProcess.split('\n').filter(Boolean) : [
    '1. Submit your online admission enquiry',
    '2. Connect with our admission counselling team',
    '3. Verify your eligibility documents',
    '4. Complete registration and enrollment'
  ];

  return (
    <div className="detail-wrapper">
      <Navbar />

      <main className="detail-container">
        <section className="detail-hero">
          <div className="detail-hero-top">
            <span className="detail-badge">
              {isGraduation ? 'Graduation Degree' : 'Vocational Course'}
            </span>
            <button className="back-link-btn" onClick={() => window.location.hash = `#programs?path=${program.educationPath}`}>
              Back to Catalog
            </button>
          </div>

          <h1 className="detail-title">{program.name}</h1>
          <p className="detail-short-desc">{program.shortDescription}</p>

          <button className="admission-btn-primary" onClick={handleConnectAdmission}>
            Get Admission Guidance
          </button>
        </section>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">Time</div>
            <div className="metric-label">Duration</div>
            <div className="metric-value">{program.duration}</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">Req</div>
            <div className="metric-label">Eligibility</div>
            <div className="metric-value">{program.eligibility}</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">Mode</div>
            <div className="metric-label">Study Mode</div>
            <div className="metric-value">{program.studyMode || 'Regular / Full-Time'}</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">Type</div>
            <div className="metric-label">Category</div>
            <div className="metric-value">{isGraduation ? 'Degree' : 'Diploma / Cert'}</div>
          </div>
        </div>

        {program.overview && (
          <section className="detail-section-card">
            <h2 className="section-heading">About the Program</h2>
            <p className="section-text">{program.overview}</p>
          </section>
        )}

        {studyItems.length > 0 && (
          <section className="detail-section-card">
            <h2 className="section-heading">What You Will Study</h2>
            <div className="study-pills-container">
              {studyItems.map((item, idx) => (
                <div key={idx} className="study-pill">
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}

        {program.whyChoose && (
          <section className="detail-section-card">
            <h2 className="section-heading">Why Choose This Program</h2>
            <p className="section-text">{program.whyChoose}</p>
          </section>
        )}

        <section className="detail-section-card">
          <h2 className="section-heading">Admission Process</h2>
          <p className="section-text" style={{ marginBottom: '1.25rem' }}>
            Follow these simple steps to receive direct counseling support and proceed with your admission:
          </p>
          <div className="admission-steps-grid">
            {admissionSteps.map((stepStr, idx) => {
              const cleanedText = stepStr.replace(/^\d+\.\s*/, '');
              return (
                <div key={idx} className="step-card">
                  <div className="step-num">{idx + 1}</div>
                  <div className="step-title">{cleanedText}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="cta-banner-card">
          <h2 className="cta-banner-title">Ready to take the next step in {program.code}?</h2>
          <p className="cta-banner-subtitle">
            Connect with our admission support team to get your questions answered and receive genuine guidance.
          </p>
          <button className="admission-btn-primary" onClick={handleConnectAdmission}>
            Connect for Admission
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
