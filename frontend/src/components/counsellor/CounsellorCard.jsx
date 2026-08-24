import React from 'react';

function getInitials(name) {
  if (!name) return 'AD';
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export default function CounsellorCard({ counsellor, onViewProfile, onConnect }) {
  if (!counsellor) return null;

  const cleanPhone = counsellor.phone ? counsellor.phone.replace(/[^0-9]/g, '') : '';
  const waUrl = cleanPhone ? `https://wa.me/91${cleanPhone.length === 10 ? cleanPhone : cleanPhone.slice(-10)}` : null;

  return (
    <div className="counsellor-card">
      <div className="counsellor-card-top">
        <div className="avatar-wrapper">
          <div className="avatar-circle">
            {getInitials(counsellor.name)}
          </div>
          <span className="verified-badge-pill" title="Verified Admission Officer">✓ Verified</span>
        </div>
        <span className="exp-badge">{counsellor.experience || 'Senior Advisor'}</span>
      </div>

      <h3 className="counsellor-name">{counsellor.name}</h3>
      <div className="counsellor-designation">{counsellor.designation}</div>

      <p className="counsellor-bio">
        {counsellor.bio}
      </p>

      {/* Direct Contact Info Box */}
      <div className="counsellor-contact-box">
        {counsellor.phone && (
          <div className="contact-row">
            <span className="contact-icon">📞</span>
            <a href={`tel:+91${cleanPhone}`} className="contact-link" title="Call directly">
              +91 {counsellor.phone}
            </a>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-quick-btn"
                title="Chat on WhatsApp"
              >
                WhatsApp
              </a>
            )}
          </div>
        )}
        {counsellor.email && (
          <div className="contact-row">
            <span className="contact-icon">✉️</span>
            <a href={`mailto:${counsellor.email}`} className="contact-link" title="Send email">
              {counsellor.email}
            </a>
          </div>
        )}
      </div>

      {counsellor.handledProgramNames && counsellor.handledProgramNames.length > 0 && (
        <div className="handled-programs-row">
          <span className="programs-label">Specialized Admissions:</span>
          <div className="program-tags-list">
            {counsellor.handledProgramNames.map((pName, idx) => (
              <span key={idx} className="counsellor-prog-tag">{pName.split('-')[0].trim()}</span>
            ))}
          </div>
        </div>
      )}

      <div className="counsellor-actions">
        <button
          className="counsellor-sec-btn"
          onClick={() => onViewProfile(counsellor.id)}
        >
          View Details
        </button>
        <button
          className="counsellor-pri-btn"
          onClick={() => onConnect(counsellor.id)}
        >
          Connect for Admission
        </button>
      </div>
    </div>
  );
}
