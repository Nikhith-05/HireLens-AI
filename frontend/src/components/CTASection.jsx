import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-bg-effects">
        <div className="cta-orb cta-orb-1" />
        <div className="cta-orb cta-orb-2" />
      </div>
      <div className="cta-container">
        <h2 className="cta-title">
          Ready to make hiring<br />
          <span className="gradient-text">transparent?</span>
        </h2>
        <p className="cta-subtitle">
          Upload your first resume and see the power of Explainable AI in action.
        </p>
        <Link to="/upload-resume" className="btn btn-primary btn-xl cta-btn" id="cta-try-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="M12 5l7 7-7 7"/>
          </svg>
          Try HireLens AI Now
        </Link>
      </div>
    </section>
  );
}
