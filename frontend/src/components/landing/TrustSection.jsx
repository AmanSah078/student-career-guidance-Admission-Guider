import React from 'react';
import SectionHeading from '../common/SectionHeading';

export default function TrustSection() {
  return (
    <section id="why-trust-us" className="landing-section landing-section-alt">
      <div className="container">
        <SectionHeading
          badge="Our Core Promise"
          title="We Help You Understand First. Then Decide."
          subtitle="Unlike pushy marketing portals, our priority is giving you genuine clarity so you can make an informed choice for your future."
        />

        <div className="trust-grid">
          <div className="trust-card">
            <div className="trust-icon">🔍</div>
            <h3 className="trust-title">Unbiased Transparency</h3>
            <p className="trust-desc">
              We present both the advantages and real challenges of each program so you know exactly what to expect before enrolling.
            </p>
          </div>

          <div className="trust-card">
            <div className="trust-icon">💡</div>
            <h3 className="trust-title">Senior Perspective</h3>
            <p className="trust-desc">
              Learn directly from students and alumni who have walked the same path and can share honest, practical advice.
            </p>
          </div>

          <div className="trust-card">
            <div className="trust-icon">🎯</div>
            <h3 className="trust-title">Future Scope First</h3>
            <p className="trust-desc">
              We connect your current education choice to actual future job markets, emerging industries, and long-term career growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
