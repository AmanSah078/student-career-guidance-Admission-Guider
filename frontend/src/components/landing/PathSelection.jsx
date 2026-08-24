import React from 'react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';

export default function PathSelection() {
  return (
    <section id="pathways" className="landing-section landing-section-alt">
      <div className="container">
        <SectionHeading
          badge="Education Directions"
          title="Choose Your Education Path"
          subtitle="Whether you are aiming for a full university degree or specialized technical skills, explore structured programs tailored to your ambitions."
        />

        <div className="path-grid">
          <div className="path-card">
            <div className="path-header">
              <div className="path-icon-wrapper path-icon-grad">🎓</div>
              <div>
                <h3 className="path-title">Graduation Degrees</h3>
                <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '600' }}>3-4 Year Programs</span>
              </div>
            </div>

            <p className="path-desc">
              Explore comprehensive Bachelor degree programs across Science, Engineering, Commerce, Management, and Arts.
              Understand curriculum depth and post-graduation opportunities.
            </p>

            <ul className="path-features">
              <li className="path-feature-item"><span className="feature-check">✓</span> Comprehensive Academic Foundations</li>
              <li className="path-feature-item"><span className="feature-check">✓</span> Higher Education and Global Scope</li>
              <li className="path-feature-item"><span className="feature-check">✓</span> Campus Placement and Industry Exposure</li>
              <li className="path-feature-item"><span className="feature-check">✓</span> Senior Guidance for Specializations</li>
            </ul>

            <Button variant="primary" onClick={() => window.location.hash = '#programs?path=GRADUATION'}>
              Explore Graduation Programs
            </Button>
          </div>

          <div className="path-card">
            <div className="path-header">
              <div className="path-icon-wrapper path-icon-course">🛠️</div>
              <div>
                <h3 className="path-title">Skill and Tech Courses</h3>
                <span style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: '600' }}>Fast-Track and Professional</span>
              </div>
            </div>

            <p className="path-desc">
              Discover industry-focused technical, vocational, and professional certification courses designed for direct job readiness
              and practical skill acquisition.
            </p>

            <ul className="path-features">
              <li className="path-feature-item"><span className="feature-check">✓</span> Hands-on Industry Skill Training</li>
              <li className="path-feature-item"><span className="feature-check">✓</span> Accelerated Career Entry (3-12 Months)</li>
              <li className="path-feature-item"><span className="feature-check">✓</span> Project-Based Learning Modules</li>
              <li className="path-feature-item"><span className="feature-check">✓</span> Direct Industry Counsellor Mentorship</li>
            </ul>

            <Button variant="accent" onClick={() => window.location.hash = '#programs?path=COURSES'}>
              Explore Technical Courses
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
