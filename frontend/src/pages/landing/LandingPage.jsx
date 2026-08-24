import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/landing/Hero';
import PathSelection from '../../components/landing/PathSelection';
import HowItWorks from '../../components/landing/HowItWorks';
import TrustSection from '../../components/landing/TrustSection';
import StudentFeedback from '../../components/landing/StudentFeedback';
import FinalCTA from '../../components/landing/FinalCTA';
import Footer from '../../components/layout/Footer';
import '../../styles/landing.css';

export default function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <PathSelection />
        <HowItWorks />
        <TrustSection />
        <StudentFeedback />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
