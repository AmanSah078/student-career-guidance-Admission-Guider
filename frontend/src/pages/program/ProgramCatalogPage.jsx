import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProgramCard from '../../components/program/ProgramCard';
import { fetchProgramsByPath, selectStudentProgram } from '../../services/programService';
import '../../styles/landing.css';
import '../../styles/program.css';

export default function ProgramCatalogPage({ educationPath = 'GRADUATION', studentId = null, onSelectProgram }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectingId, setSelectingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');

    fetchProgramsByPath(educationPath)
      .then((data) => {
        setPrograms(data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load available programs catalog.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [educationPath]);

  const handleProgramSelect = async (programId) => {
    setSelectingId(programId);
    try {
      if (studentId) {
        await selectStudentProgram(studentId, programId);
      }
      if (onSelectProgram) {
        onSelectProgram(programId);
      } else {
        window.location.hash = `#program-details?id=${programId}`;
      }
    } catch {
      window.location.hash = `#program-details?id=${programId}`;
    } finally {
      setSelectingId(null);
    }
  };

  const isGraduation = educationPath === 'GRADUATION';

  return (
    <div className="catalog-wrapper">
      <Navbar />

      <main className="catalog-container">
        <div className="catalog-header">
          <span className="catalog-badge">
            {isGraduation ? 'Graduation Degree Programs' : 'Vocational and Technical Courses'}
          </span>
          <h1 className="catalog-title">
            {isGraduation ? 'Explore Graduation Degree Pathways' : 'Explore Technical and Vocational Courses'}
          </h1>
          <p className="catalog-subtitle">
            Here are the database-verified options matching your education path. Choose a program to explore its syllabus, future opportunities, and senior guidance.
          </p>
        </div>

        {error && (
          <div className="alert-box alert-danger" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="program-cards-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : programs.length === 0 ? (
          <div className="empty-catalog-box">
            <div className="empty-icon">Empty</div>
            <h3 style={{ fontSize: '1.4rem', color: '#f0f6fc', marginBottom: '0.5rem' }}>
              We are preparing the right options for you.
            </h3>
            <p style={{ color: '#8b949e', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              New programs for this education path are currently being updated in our system. Please check back shortly.
            </p>
            <button
              className="program-cta-btn"
              style={{ maxWidth: '220px', margin: '0 auto' }}
              onClick={() => window.location.hash = '#onboarding'}
            >
              Change Education Path
            </button>
          </div>
        ) : (
          <div className="program-cards-grid">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onSelect={handleProgramSelect}
                loading={selectingId === program.id}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
