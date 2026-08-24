import React from 'react';
import Button from '../common/Button';

export default function Hero() {
  return (
    <section id="hero" className="landing-section hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-tag">
            <span>✨ Senior Career Guidance and Admission Platform</span>
          </div>

          <h1 className="hero-title">
            Your Future Starts With the <span>Right Choice.</span>
          </h1>

          <p className="hero-description">
            Do not choose your degree or course in the dark. Explore programs, understand your
            real future scope, and receive genuine guidance from trusted seniors before taking admission.
          </p>

          <div className="hero-actions">
            <Button variant="primary" size="lg" onClick={() => window.location.hash = '#pathways'}>
              Explore Your Path
            </Button>
            <Button variant="secondary" size="lg" onClick={() => window.location.hash = '#how-it-works'}>
              How It Works
            </Button>
          </div>

          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-value">Graduation and Courses</span>
              <span className="stat-label">Clear Program Roadmaps</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Senior Advice</span>
              <span className="stat-label">Real Career Insights</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Direct Guidance</span>
              <span className="stat-label">Counsellor Connections</span>
            </div>
          </div>
        </div>

        <div className="hero-visual-card">
          <div className="guidance-preview-box">
            <div className="guidance-card-item">
              <div className="guidance-icon">🎓</div>
              <div>
                <div className="guidance-text-title">Degree and Course Clarity</div>
                <div className="guidance-text-desc">Understand syllabus, real-world skills, and job prospects before enrolling.</div>
              </div>
            </div>

            <div className="guidance-card-item">
              <div className="guidance-icon">💡</div>
              <div>
                <div className="guidance-text-title">Senior Career Direction</div>
                <div className="guidance-text-desc">Learn what industry seniors wish they knew when they were in your shoes.</div>
              </div>
            </div>

            <div className="guidance-card-item">
              <div className="guidance-icon">🤝</div>
              <div>
                <div className="guidance-text-title">Admission Assistance</div>
                <div className="guidance-text-desc">Connect directly with authentic counsellors when you are confident in your decision.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
