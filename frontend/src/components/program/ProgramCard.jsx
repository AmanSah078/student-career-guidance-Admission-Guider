import React from 'react';

export default function ProgramCard({ program, onSelect, loading }) {
  if (!program) return null;

  const getBadgeText = (code) => {
    switch (code) {
      case 'BSC': return '🧪';
      case 'BA': return '📚';
      case 'BED': return '🎓';
      case 'DELED': return '🏫';
      case 'ITI': return '⚙️';
      case 'POLYTECHNIC': return '🛠️';
      default: return '🎓';
    }
  };

  return (
    <div className="program-catalog-card">
      <div className="program-card-header">
        <div className="program-card-icon">{getBadgeText(program.code)}</div>
        <span className="program-duration-badge">{program.duration}</span>
      </div>

      <h3 className="program-title">{program.name}</h3>

      <p className="program-description">
        {program.shortDescription}
      </p>

      <div className="program-meta">
        <span className="meta-label">Eligibility:</span>
        <span className="meta-value">{program.eligibility}</span>
      </div>

      <button
        className="program-cta-btn"
        onClick={() => onSelect(program.id)}
        disabled={loading}
      >
        {loading ? 'Saving Choice...' : 'Explore Program'}
      </button>
    </div>
  );
}
