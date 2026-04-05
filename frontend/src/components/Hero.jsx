import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (el) el.classList.add('hero-visible');
  }, []);

  return (
    <section className="hero-section" ref={heroRef} id="hero">
      {/* Animated background orbs */}
      <div className="hero-bg-effects">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid-overlay" />
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Powered by Explainable AI
        </div>

        <h1 className="hero-title">
          <span className="hero-title-gradient">HireLens AI</span>
        </h1>

        <p className="hero-tagline">
          See exactly why candidates get selected.
        </p>

        <p className="hero-description">
          HireLens AI uses Explainable Artificial Intelligence to analyze resumes against
          job descriptions and provide transparent hiring insights. Make every hiring
          decision data-driven, fair, and fully understood.
        </p>

        <div className="hero-actions">
          <Link to="/upload-resume" className="btn btn-primary btn-xl hero-cta" id="hero-cta-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Start Screening Resumes
          </Link>
          <a href="#how-it-works" className="btn btn-ghost btn-xl">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            View Demo
          </a>
        </div>

        {/* Floating stat chips */}
        <div className="hero-stats">
          <div className="hero-stat-chip">
            <span className="hero-stat-number">95%</span>
            <span className="hero-stat-label">Accuracy</span>
          </div>
          <div className="hero-stat-chip">
            <span className="hero-stat-number">&lt;3s</span>
            <span className="hero-stat-label">Per Resume</span>
          </div>
          <div className="hero-stat-chip">
            <span className="hero-stat-number">100%</span>
            <span className="hero-stat-label">Transparent</span>
          </div>
        </div>
      </div>

      {/* Floating preview card */}
      <div className="hero-preview">
        <div className="hero-preview-card">
          <div className="hero-preview-header">
            <div className="hero-preview-dots">
              <span /><span /><span />
            </div>
            <span className="hero-preview-title">Screening Result</span>
          </div>
          <div className="hero-preview-body">
            <div className="hero-preview-score-row">
              <div className="hero-preview-gauge">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="6"/>
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#22c55e" strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * 0.16}`}
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                  <text x="40" y="38" textAnchor="middle" fill="#22c55e" fontSize="16" fontWeight="800">84%</text>
                  <text x="40" y="50" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="500">MATCH</text>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>John Doe</div>
                <div style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>✅ Selected</div>
              </div>
            </div>
            <div className="hero-preview-skills">
              <span className="hero-preview-tag matched">✓ Python</span>
              <span className="hero-preview-tag matched">✓ ML</span>
              <span className="hero-preview-tag matched">✓ SQL</span>
              <span className="hero-preview-tag missing">✗ Docker</span>
            </div>
            <div className="hero-preview-bars">
              <div className="hero-preview-bar">
                <span>Skills</span>
                <div className="hero-preview-bar-track"><div className="hero-preview-bar-fill" style={{ width: '85%' }} /></div>
              </div>
              <div className="hero-preview-bar">
                <span>Experience</span>
                <div className="hero-preview-bar-track"><div className="hero-preview-bar-fill medium" style={{ width: '65%' }} /></div>
              </div>
              <div className="hero-preview-bar">
                <span>Education</span>
                <div className="hero-preview-bar-track"><div className="hero-preview-bar-fill" style={{ width: '90%' }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
