import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-title">SeniorGuide</div>
            <p className="footer-brand-desc">
              Your trusted educational companion. We help students explore degree pathways,
              understand future career scopes, and connect with experienced mentors before making admission decisions.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><a href="#pathways" className="footer-link">Graduation Degrees</a></li>
              <li><a href="#pathways" className="footer-link">Technical Courses</a></li>
              <li><a href="#how-it-works" className="footer-link">How Guidance Works</a></li>
              <li><a href="#why-trust-us" className="footer-link">Senior Mentorship</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Guidance</h4>
            <ul className="footer-links">
              <li><a href="#how-it-works" className="footer-link">Career Roadmap</a></li>
              <li><a href="#why-trust-us" className="footer-link">Future Scope Analysis</a></li>
              <li><a href="#feedback" className="footer-link">Student Testimonials</a></li>
              <li><a href="#cta" className="footer-link">Connect with Counsellors</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Platform Policy</h4>
            <ul className="footer-links">
              <li><a href="#hero" className="footer-link">Privacy Policy</a></li>
              <li><a href="#hero" className="footer-link">Terms of Service</a></li>
              <li><a href="#hero" className="footer-link">Student Code of Ethics</a></li>
              <li><a href="#hero" className="footer-link">Admission Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{new Date().getFullYear()} Student Career Guidance and Admission Platform. All rights reserved.</p>
          <p>Designed with clarity, trust, and senior guidance at heart.</p>
        </div>
      </div>
    </footer>
  );
}
