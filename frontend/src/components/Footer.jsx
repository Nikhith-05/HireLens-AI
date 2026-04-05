export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: '0.75rem' }}>
              <div className="logo-icon-wrap">
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                  <defs>
                    <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="36" y2="36">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <rect width="36" height="36" rx="10" fill="url(#footerLogoGrad)" />
                  <path d="M10 18h6l2.5-5 3 10 2.5-5h4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <span className="logo-text" style={{ fontSize: '1.1rem' }}>HireLens AI</span>
            </div>
            <p className="footer-tagline">See exactly why candidates get selected.</p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4 className="footer-col-title">Product</h4>
              <a href="#features" className="footer-link">Features</a>
              <a href="#how-it-works" className="footer-link">How it Works</a>
              <a href="#explainable-ai" className="footer-link">Explainable AI</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Resources</h4>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">API Reference</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HireLens AI. Built with Explainable AI.</p>
        </div>
      </div>
    </footer>
  );
}
