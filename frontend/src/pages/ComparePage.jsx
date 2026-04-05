import { useState, useEffect } from 'react';
import { getJobs, getResumes, compareResumes } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import FeatureBars from '../components/FeatureBars';
import SkillTags from '../components/SkillTags';

export default function ComparePage() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [resumeA, setResumeA] = useState('');
  const [resumeB, setResumeB] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, resumesData] = await Promise.all([getJobs(), getResumes()]);
      setJobs(jobsData.jobs || []);
      setResumes(resumesData.resumes || []);
    } catch (err) {
      console.error('Failed to load data', err);
    }
  };

  const handleCompare = async () => {
    if (!resumeA || !resumeB || !selectedJob) return;
    if (resumeA === resumeB) {
      setError('Please select two different candidates');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await compareResumes(Number(resumeA), Number(resumeB), Number(selectedJob));
      setComparison(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Comparison failed');
    }
    setLoading(false);
  };

  const CandidateColumn = ({ candidate, label }) => (
    <div>
      <div className="card" style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          {candidate.candidate_name}
        </h3>
        <ScoreGauge score={candidate.match_score} label="Match" />
        <div style={{
          marginTop: '0.75rem', fontWeight: 700,
          color: candidate.prediction === 'Selected' ? 'var(--success)' : 'var(--danger)',
        }}>
          {candidate.prediction === 'Selected' ? '✅' : '❌'} {candidate.prediction}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>Metrics</h4>
        <FeatureBars scores={{
          skill_score: candidate.skills_coverage,
          experience_score: candidate.experience_relevance,
          project_score: candidate.project_relevance,
          education_score: candidate.education_match,
        }} />
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--success)' }}>
          👍 Pros
        </h4>
        {candidate.pros?.map((p, i) => (
          <div key={i} className="explanation-item positive" style={{ fontSize: '0.85rem' }}>
            <span className="explanation-icon">✓</span>
            <span>{p}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--danger)' }}>
          👎 Cons
        </h4>
        {candidate.cons?.map((c, i) => (
          <div key={i} className="explanation-item negative" style={{ fontSize: '0.85rem' }}>
            <span className="explanation-icon">✗</span>
            <span>{c}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h4 style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Skills</h4>
        {candidate.matched_skills?.length > 0 && (
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>MATCHED</div>
            <SkillTags skills={candidate.matched_skills} type="matched" />
          </div>
        )}
        {candidate.missing_skills?.length > 0 && (
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>MISSING</div>
            <SkillTags skills={candidate.missing_skills} type="missing" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">⚖️ Compare Candidates</h1>
        <p className="page-subtitle">Side-by-side comparison of two candidates for the same role</p>
      </div>

      {/* Selection Form */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="select-group">
          <div className="form-group">
            <label className="form-label" htmlFor="compare-job-select">Job Description</label>
            <select id="compare-job-select" className="form-select" value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
              <option value="">-- Select Job --</option>
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="compare-resume-a">Candidate A</label>
            <select id="compare-resume-a" className="form-select" value={resumeA} onChange={(e) => setResumeA(e.target.value)}>
              <option value="">-- Select Resume --</option>
              {resumes.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.file_name})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="compare-resume-b">Candidate B</label>
            <select id="compare-resume-b" className="form-select" value={resumeB} onChange={(e) => setResumeB(e.target.value)}>
              <option value="">-- Select Resume --</option>
              {resumes.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.file_name})</option>)}
            </select>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginTop: '0.75rem',
            background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '0.85rem',
            border: '1px solid rgba(239,68,68,0.2)',
          }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            id="compare-btn"
            className="btn btn-primary"
            onClick={handleCompare}
            disabled={!selectedJob || !resumeA || !resumeB || loading}
          >
            {loading ? 'Comparing...' : '⚖️ Compare Candidates'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <div className="loading-text">Comparing candidates...</div>
        </div>
      )}

      {/* Comparison Results */}
      {!loading && comparison && (
        <div className="scale-in">
          {/* Recommendation */}
          <div className="card" style={{
            marginBottom: '1.5rem', textAlign: 'center',
            background: 'linear-gradient(145deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))',
            borderColor: 'var(--border-active)',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
              📋 Recommendation
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {comparison.recommendation}
            </p>
          </div>

          {/* Side by Side */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '1rem',
            alignItems: 'start',
          }}>
            <CandidateColumn candidate={comparison.candidate_a} label="A" />
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem', fontWeight: 800, fontSize: '1.2rem',
              color: 'var(--accent-primary)', height: '100%',
              position: 'sticky', top: '100px',
            }}>
              VS
            </div>
            <CandidateColumn candidate={comparison.candidate_b} label="B" />
          </div>
        </div>
      )}

      {!loading && !comparison && (
        <div className="empty-state">
          <div className="empty-icon">⚖️</div>
          <div className="empty-title">Compare Two Candidates</div>
          <div className="empty-subtitle">Select a job and two candidates above to see a detailed comparison</div>
        </div>
      )}
    </div>
  );
}
