const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: 'Resume Parsing',
    description: 'Automatically extracts skills, experience, education, projects, and certifications from PDF, DOCX, and TXT resumes.',
    color: '#6366f1',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
    title: 'Smart Resume Matching',
    description: 'Analyzes resumes against job descriptions using weighted AI scoring across skills, experience, projects, and education.',
    color: '#8b5cf6',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: 'Explainable AI Decisions',
    description: 'Shows exactly why a candidate is selected or rejected — matched skills, missing skills, strengths, weaknesses, and factor analysis.',
    color: '#22c55e',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <rect x="2" y="20" width="20" height="2" rx="1" fill="currentColor" opacity="0.2"/>
      </svg>
    ),
    title: 'Resume Comparison',
    description: 'Compare two candidates side-by-side with detailed pros, cons, and a data-driven recommendation.',
    color: '#f59e0b',
  },
];

export default function Features() {
  return (
    <section className="landing-section" id="features">
      <div className="section-container">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2 className="section-title">Everything You Need for<br /><span className="gradient-text">Transparent Hiring</span></h2>
          <p className="section-subtitle">
            From resume parsing to explainable decisions — every tool to build a fair,
            data-driven hiring pipeline.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card" style={{ '--feature-color': feature.color }}>
              <div className="feature-icon-wrap" style={{ background: `${feature.color}15`, color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
              <div className="feature-glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
