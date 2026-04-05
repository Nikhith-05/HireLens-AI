import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import ComparePage from './pages/ComparePage';
import RankingPage from './pages/RankingPage';

function AppNavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="logo">
          <div className="logo-icon-wrap">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="navLogoGrad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <rect width="36" height="36" rx="10" fill="url(#navLogoGrad)" />
              <path d="M10 18h6l2.5-5 3 10 2.5-5h4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="28" cy="10" r="3" fill="#22c55e" opacity="0.9"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">HireLens AI</div>
          </div>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/upload-resume" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            Upload
          </NavLink>
          <NavLink to="/results" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            Results
          </NavLink>
          <NavLink to="/compare" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            Compare
          </NavLink>
          <NavLink to="/ranking" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            Rankings
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

function AppLayout({ children }) {
  return (
    <>
      <AppNavbar />
      <main className="main-content">{children}</main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — full-width, no app navbar */}
        <Route path="/" element={<LandingPage />} />

        {/* App pages — wrapped with app navbar */}
        <Route path="/upload-resume" element={<AppLayout><UploadPage /></AppLayout>} />
        <Route path="/results" element={<AppLayout><ResultsPage /></AppLayout>} />
        <Route path="/compare" element={<AppLayout><ComparePage /></AppLayout>} />
        <Route path="/ranking" element={<AppLayout><RankingPage /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
