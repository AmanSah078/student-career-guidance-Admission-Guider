import React from 'react';

/**
 * Reusable Section Heading component with optional badge, title, and subtitle.
 */
export default function SectionHeading({ badge, title, subtitle, className = '' }) {
  return (
    <div className={`section-header ${className}`}>
      {badge && <div className="section-badge">{badge}</div>}
      {title && <h2 className="section-title">{title}</h2>}
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
