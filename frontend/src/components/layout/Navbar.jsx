import React, { useEffect, useState } from 'react';
import Button from '../common/Button';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('skillpilot_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skillpilot_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <a href="#hero" className="nav-brand">
          <div className="brand-icon">🎓</div>
          <span>SeniorGuide</span>
        </a>

        <ul className="nav-links">
          <li><a href="#hero" className="nav-link">Home</a></li>
          <li><a href="#pathways" className="nav-link">Explore Paths</a></li>
          <li><a href="#how-it-works" className="nav-link">How It Works</a></li>
          <li><a href="#why-trust-us" className="nav-link">Why Us</a></li>
          <li><a href="#feedback" className="nav-link">Student Voice</a></li>
          <li><a href="#team" className="nav-link">Our Team</a></li>
        </ul>

        <div className="nav-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleTheme}
            title="Toggle SkillPilot UI Theme"
            style={{
              background: 'var(--color-primary-light)',
              border: '1px solid var(--color-card-border)',
              borderRadius: '50px',
              padding: '0.4rem 0.85rem',
              color: 'var(--color-text-main)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            {theme === 'dark' ? 'Dark' : 'Light'}
          </button>

          <Button variant="secondary" onClick={() => window.location.hash = '#login'}>
            Login
          </Button>

          <Button variant="primary" onClick={() => window.location.hash = '#register'}>
            Get Started
          </Button>
        </div>

        <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation">
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-drawer">
          <a href="#hero" className="nav-link" onClick={() => setMobileOpen(false)}>Home</a>
          <a href="#pathways" className="nav-link" onClick={() => setMobileOpen(false)}>Explore Paths</a>
          <a href="#how-it-works" className="nav-link" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#why-trust-us" className="nav-link" onClick={() => setMobileOpen(false)}>Why Us</a>
          <a href="#feedback" className="nav-link" onClick={() => setMobileOpen(false)}>Student Voice</a>
          <a href="#team" className="nav-link" onClick={() => setMobileOpen(false)}>Our Team</a>

          <button
            onClick={() => { toggleTheme(); setMobileOpen(false); }}
            style={{
              padding: '0.6rem 1rem',
              background: 'var(--color-primary-light)',
              border: '1px solid var(--color-card-border)',
              borderRadius: '8px',
              color: 'var(--color-text-main)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Switch Theme ({theme === 'dark' ? 'Light' : 'Dark'})
          </button>

          <Button variant="primary" onClick={() => { setMobileOpen(false); window.location.hash = '#register'; }}>
            Get Started
          </Button>
        </div>
      )}
    </nav>
  );
}
