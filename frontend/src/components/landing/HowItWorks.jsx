import React from 'react';
import SectionHeading from '../common/SectionHeading';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Create Your Account',
      desc: 'Sign up in seconds to build your personalized student career guidance profile.'
    },
    {
      num: '02',
      title: 'Choose Your Path',
      desc: 'Select between standard Graduation Degree streams or modern Skill/Tech Courses.'
    },
    {
      num: '03',
      title: 'Explore Programs',
      desc: 'Dive into detailed curriculum insights, eligibility criteria, and skill requirements.'
    },
    {
      num: '04',
      title: 'Understand Your Future',
      desc: 'Analyze future career scope, potential job roles, salary trends, and growth sectors.'
    },
    {
      num: '05',
      title: 'Senior Career Guidance',
      desc: 'Get authentic advice and honest perspectives from seniors and industry alumni.'
    },
    {
      num: '06',
      title: 'Connect & Admission',
      desc: 'Reach out to verified admission counsellors with confidence when you are ready.'
    }
  ];

  return (
    <section id="how-it-works" className="landing-section">
      <div className="container">
        <SectionHeading
          badge="Clear Journey"
          title="How Senior Guidance Works"
          subtitle="A simple, transparent 6-step journey designed to move you from confusion to clarity and confident admission."
        />

        <div className="timeline-container">
          {steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
