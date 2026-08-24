import React, { useState, useEffect } from 'react';
import LandingPage from './pages/landing/LandingPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import ProgramCatalogPage from './pages/program/ProgramCatalogPage';
import ProgramDetailPage from './pages/program/ProgramDetailPage';
import CounsellorsPage from './pages/counsellor/CounsellorsPage';
import CounsellorDetailPage from './pages/counsellor/CounsellorDetailPage';
import AdmissionEnquiryPage from './pages/connect/AdmissionEnquiryPage';
import { getVerifiedStudentId } from './services/authService';

const LANDING_SECTION_HASHES = new Set([
  '#landing',
  '#hero',
  '#pathways',
  '#how-it-works',
  '#why-trust-us',
  '#feedback',
  '#cta',
]);

function getRouteHash(hash) {
  return (hash || '#landing').split('?')[0];
}

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#landing');
  const routeHash = getRouteHash(currentHash);
  const activeStudentId = getVerifiedStudentId(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#landing');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const scrollTimer = window.setTimeout(() => {
      if (LANDING_SECTION_HASHES.has(routeHash) && routeHash !== '#landing') {
        const target = document.getElementById(routeHash.slice(1));
        if (target) {
          target.scrollIntoView({ block: 'start' });
          return;
        }
      }
      window.scrollTo(0, 0);
    }, 0);

    return () => window.clearTimeout(scrollTimer);
  }, [routeHash]);

  if (routeHash === '#team' || routeHash === '#counsellors') {
    return <CounsellorsPage />;
  }

  if (routeHash === '#counsellor-detail') {
    return <CounsellorDetailPage />;
  }

  if (routeHash === '#request-guidance') {
    return <AdmissionEnquiryPage />;
  }

  if (routeHash === '#register') {
    return <RegisterPage />;
  }

  if (routeHash === '#verify-email') {
    return <VerifyEmailPage />;
  }

  if (routeHash === '#login') {
    return <LoginPage />;
  }

  if (routeHash === '#forgot-password') {
    return <ForgotPasswordPage />;
  }

  if (routeHash === '#reset-password') {
    return <ResetPasswordPage />;
  }

  if (routeHash === '#onboarding') {
    return <OnboardingPage studentId={activeStudentId} />;
  }

  if (routeHash === '#programs') {
    let path = 'GRADUATION';
    if (currentHash.includes('path=')) {
      path = currentHash.split('path=')[1].split('&')[0];
    }
    return <ProgramCatalogPage educationPath={path} studentId={activeStudentId} />;
  }

  if (routeHash === '#program-details') {
    return <ProgramDetailPage />;
  }

  return <LandingPage />;
}
