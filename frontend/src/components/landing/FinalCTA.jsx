import React from 'react';
import Button from '../common/Button';

export default function FinalCTA() {
  return (
    <section id="cta" className="landing-section">
      <div className="container">
        <div className="cta-banner">
          <h2 className="cta-title">Not Sure What to Choose?</h2>
          <p className="cta-subtitle">
            Let us help you understand your options, evaluate your interests, and find the education path that fits your future.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="accent" size="lg" onClick={() => window.location.hash = '#register'}>
              Let's Brighten Your Future
            </Button>
            <Button variant="secondary" size="lg" onClick={() => window.location.hash = '#how-it-works'}>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
