export default function ExplainableSection() {
  return (
    <section className="landing-section" id="explainable-ai">
      <div className="section-container">
        <div className="section-header">
          <span className="section-badge">Core Feature</span>
          <h2 className="section-title">Transparent Hiring with<br /><span className="gradient-text">Explainable AI</span></h2>
          <p className="section-subtitle">
            Every screening decision comes with a full breakdown — no black boxes, no guesswork.
          </p>
        </div>

        <div className="xai-layout">
          {/* Left: Description */}
          <div className="xai-info">
            <div className="xai-info-item">
              <div className="xai-info-icon" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <div>
                <h4>Full Visibility</h4>
                <p>See exactly which factors increased or decreased the candidate's score — skills, experience, education, projects.</p>
              </div>
            </div>
            <div className="xai-info-item">
              <div className="xai-info-icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h4>Fair & Unbiased</h4>
                <p>Structured scoring ensures decisions are based on merit, not gut feeling. Every score is reproducible and auditable.</p>
              </div>
            </div>
            <div className="xai-info-item">
              <div className="xai-info-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <h4>Actionable Insights</h4>
                <p>Candidates can see what they're missing. Recruiters understand exactly why candidates were ranked the way they were.</p>
              </div>
            </div>
          </div>

          {/* Right: Example Card */}
          <div className="xai-example-card">
            <div className="xai-example-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, color: 'white',
                }}>JD</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>John Doe</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Senior Python Developer</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#22c55e' }}>84%</span>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
                  background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)',
                }}>SELECTED</span>
              </div>
            </div>

            <div className="xai-example-section">
              <div className="xai-example-label">Matched Skills</div>
              <div className="xai-example-tags">
                <span className="xai-tag matched">✓ Python</span>
                <span className="xai-tag matched">✓ Machine Learning</span>
                <span className="xai-tag matched">✓ SQL</span>
              </div>
            </div>

            <div className="xai-example-section">
              <div className="xai-example-label">Missing Skills</div>
              <div className="xai-example-tags">
                <span className="xai-tag missing">✗ Docker</span>
                <span className="xai-tag missing">✗ Kubernetes</span>
              </div>
            </div>

            <div className="xai-example-section">
              <div className="xai-example-label">Strengths</div>
              <div className="xai-example-list">
                <div className="xai-list-item positive">
                  <span>✓</span> Relevant ML project experience
                </div>
                <div className="xai-list-item positive">
                  <span>✓</span> Strong Python proficiency
                </div>
                <div className="xai-list-item positive">
                  <span>✓</span> Education requirement met
                </div>
              </div>
            </div>

            <div className="xai-example-section">
              <div className="xai-example-label">Weaknesses</div>
              <div className="xai-example-list">
                <div className="xai-list-item negative">
                  <span>✗</span> Limited work experience (1 year)
                </div>
                <div className="xai-list-item negative">
                  <span>✗</span> No container/DevOps skills
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
