const steps = [
  {
    num: '01',
    title: 'Upload Resume',
    description: 'Upload candidate resumes in PDF, DOCX, or TXT format. Our parser automatically extracts structured data.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Add Job Description',
    description: 'Provide the role requirements and job description. The AI extracts required skills, experience, and education.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'AI Analysis',
    description: 'HireLens AI evaluates candidate-job compatibility using weighted scoring, skill matching, and semantic analysis.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/>
        <circle cx="12" cy="14" r="2"/>
        <path d="M12 16v2"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Explainable Results',
    description: 'See match scores, feature breakdowns, matched and missing skills, strengths, weaknesses, and transparent explanations.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="landing-section hiw-section" id="how-it-works">
      <div className="section-container">
        <div className="section-header">
          <span className="section-badge">Process</span>
          <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
          <p className="section-subtitle">
            Four simple steps from resume upload to explainable hiring insights.
          </p>
        </div>

        <div className="hiw-timeline">
          {steps.map((step, i) => (
            <div key={i} className="hiw-step">
              <div className="hiw-step-connector">
                <div className="hiw-step-num">{step.num}</div>
                {i < steps.length - 1 && <div className="hiw-step-line" />}
              </div>
              <div className="hiw-step-card">
                <div className="hiw-step-icon">{step.icon}</div>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
