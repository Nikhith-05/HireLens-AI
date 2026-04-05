import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky navbar after hero section (roughly 400px scroll for effect)
      if (window.scrollY > 400) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar landing-navbar ${isSticky ? 'is-sticky' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <div className="logo-icon-wrap">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <rect width="36" height="36" rx="10" fill="url(#logoGrad)" />
              <path d="M10 18h6l2.5-5 3 10 2.5-5h4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="28" cy="10" r="3" fill="#22c55e" opacity="0.9"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">HireLens AI</div>
          </div>
        </Link>

        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#explainable-ai" className="nav-link">Explainable AI</a>
          <Link to="/upload-resume" className="btn btn-primary btn-sm" style={{ marginLeft: '8px' }}>
            Start Screening
          </Link>
        </div>
      </div>
    </nav>
  );
}
