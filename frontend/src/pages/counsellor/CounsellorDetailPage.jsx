import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { fetchCounsellorById } from '../../services/counsellorService';
import { getVerifiedStudentId } from '../../services/authService';
import '../../styles/landing.css';
import '../../styles/counsellor.css';

function getInitials(name) {
  if (!name) return 'AD';
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export default function CounsellorDetailPage() {
  const [counsellor, setCounsellor] = useState(null);
  const [programId, setProgramId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    let id = null;
    let pId = null;

    if (hash.includes('id=')) {
      id = hash.split('id=')[1].split('&')[0];
    }
    if (hash.includes('programId=')) {
      pId = hash.split('programId=')[1].split('&')[0];
    }
    setProgramId(pId);

    if (!id) {
      setError('No counsellor specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    fetchCounsellorById(id)
      .then((data) => setCounsellor(data))
      .catch((err) => setError(err.message || 'Failed to load advisor profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestGuidance = () => {
    const studentId = getVerifiedStudentId(null);
    if (!studentId) {
      window.location.hash = '#register';
      return;
    }

    const pParam = programId ? `&programId=${programId}` : '';
    window.location.hash = `#request-guidance?counsellorId=${counsellor.id}${pParam}&studentId=${studentId}`;
  };

  return (
    <div className="counsellors-wrapper">
      <Navbar />

      <main className="counsellors-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem auto' }}></div>
            <p style={{ color: '#8b949e' }}>Loading advisor profile...</p>
          </div>
        ) : error || !counsellor ? (
          <div className="empty-catalog-box">
            <div className="empty-icon">Error</div>
            <h3 style={{ color: '#f85149', marginBottom: '0.5rem' }}>Advisor Profile Not Found</h3>
            <p style={{ color: '#8b949e', marginBottom: '1.5rem' }}>{error}</p>
            <button className="program-cta-btn" style={{ width: 'auto', margin: '0 auto' }} onClick={() => window.location.hash = '#counsellors'}>
              Back to Admission Team
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: '760px', margin: '0 auto', background: 'rgba(22, 27, 34, 0.85)', border: '1px solid #30363d', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span className="counsellors-badge">✓ Official Admission Advisor</span>
              <button className="back-link-btn" onClick={() => window.location.hash = programId ? `#counsellors?programId=${programId}` : '#counsellors'}>
                Back to Advisors List
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div className="avatar-circle" style={{ width: '76px', height: '76px', fontSize: '1.4rem', fontWeight: 800 }}>
                {getInitials(counsellor.name)}
              </div>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: '#f0f6fc', margin: 0 }}>{counsellor.name}</h1>
                <div style={{ color: '#3fb950', fontWeight: '600', fontSize: '1rem', marginTop: '0.2rem' }}>{counsellor.designation}</div>
                <span className="exp-badge" style={{ marginTop: '0.4rem', display: 'inline-block' }}>{counsellor.experience || 'Experienced Advisor'}</span>
              </div>
            </div>

            {/* Direct Official Contact Box */}
            <div className="counsellor-detail-contact-box" style={{ background: '#0d1117', border: '1px solid #238636', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#3fb950', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.85rem', fontWeight: 700 }}>
                Direct Contact Channels
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {counsellor.phone && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.2rem' }}>Direct Call / WhatsApp</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <a href={`tel:+91${counsellor.phone.replace(/[^0-9]/g, '')}`} style={{ color: '#58a6ff', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>
                        📞 +91 {counsellor.phone}
                      </a>
                      <a
                        href={`https://wa.me/91${counsellor.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wa-quick-btn"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                )}
                {counsellor.email && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.2rem' }}>Official Email</div>
                    <a href={`mailto:${counsellor.email}`} style={{ color: '#58a6ff', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', wordBreak: 'break-all' }}>
                      ✉️ {counsellor.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#f0f6fc', marginBottom: '0.5rem' }}>About {counsellor.name}</h3>
              <p style={{ color: '#c9d1d9', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{counsellor.bio}</p>
            </div>

            {counsellor.handledProgramNames && counsellor.handledProgramNames.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem' }}>Specialized Programs Handled</h4>
                <div className="program-tags-list">
                  {counsellor.handledProgramNames.map((pName, idx) => (
                    <span key={idx} className="counsellor-prog-tag" style={{ fontSize: '0.88rem', padding: '0.4rem 0.85rem' }}>
                      {pName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              className="counsellor-pri-btn"
              style={{ width: '100%', padding: '0.95rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={handleRequestGuidance}
            >
              Submit Online Admission Request
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
