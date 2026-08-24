import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import CounsellorCard from '../../components/counsellor/CounsellorCard';
import { fetchCounsellors } from '../../services/counsellorService';
import { fetchProgramById } from '../../services/programService';
import { getVerifiedStudentId } from '../../services/authService';
import '../../styles/landing.css';
import '../../styles/counsellor.css';

export default function CounsellorsPage({ programId: propProgramId }) {
  const [counsellors, setCounsellors] = useState([]);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeProgramId, setActiveProgramId] = useState(propProgramId || null);

  useEffect(() => {
    let pId = propProgramId;
    if (!pId) {
      const hash = window.location.hash;
      if (hash.includes('programId=')) {
        pId = hash.split('programId=')[1].split('&')[0];
      }
    }
    setActiveProgramId(pId);

    setLoading(true);
    setError('');

    if (pId) {
      fetchProgramById(pId)
        .then((pData) => setProgram(pData))
        .catch(() => setProgram(null));
    }

    fetchCounsellors(pId)
      .then((data) => {
        setCounsellors(data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load admission team profiles.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [propProgramId]);

  const handleViewProfile = (counsellorId) => {
    const pParam = activeProgramId ? `&programId=${activeProgramId}` : '';
    window.location.hash = `#counsellor-detail?id=${counsellorId}${pParam}`;
  };

  const handleConnect = (counsellorId) => {
    const studentId = getVerifiedStudentId(null);
    if (!studentId) {
      window.location.hash = '#register';
      return;
    }

    const pParam = activeProgramId ? `&programId=${activeProgramId}` : '';
    window.location.hash = `#request-guidance?counsellorId=${counsellorId}${pParam}&studentId=${studentId}`;
  };

  return (
    <div className="counsellors-wrapper">
      <Navbar />

      <main className="counsellors-container">
        <div className="counsellors-header">
          <span className="counsellors-badge">
            Verified Admission Guidance Team
          </span>
          <h1 className="counsellors-title">
            {program ? `Admission Advisors for ${program.name}` : 'Meet Our Admission Guidance Team'}
          </h1>
          <p className="counsellors-subtitle">
            Connect directly with verified education advisors who specialize in your program to ask questions and receive authentic guidance.
          </p>
        </div>

        {error && (
          <div className="alert-box alert-danger" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="counsellors-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : counsellors.length === 0 ? (
          <div className="empty-catalog-box">
            <div className="empty-icon">Empty</div>
            <h3 style={{ fontSize: '1.4rem', color: '#f0f6fc', marginBottom: '0.5rem' }}>
              Our admission team will be happy to help you.
            </h3>
            <p style={{ color: '#8b949e', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Our guidance desk is ready to answer your questions regarding program details and admission steps.
            </p>
            <button
              className="program-cta-btn"
              style={{ maxWidth: '240px', margin: '0 auto' }}
              onClick={() => window.location.hash = '#programs'}
            >
              Back to Program Catalog
            </button>
          </div>
        ) : (
          <div className="counsellors-grid">
            {counsellors.map((counsellor) => (
              <CounsellorCard
                key={counsellor.id}
                counsellor={counsellor}
                onViewProfile={handleViewProfile}
                onConnect={handleConnect}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
