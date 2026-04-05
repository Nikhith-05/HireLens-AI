import { useState, useEffect } from 'react';
import { getJobs, getResumes, getResults, matchBatch } from '../services/api';

export default function RankingPage() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [rankings, setRankings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false);

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

  const handleSelectJob = async (jobId) => {
    if (!jobId) return;
    setSelectedJob(jobId);
    setLoading(true);
    try {
      const data = await getResults(Number(jobId));
      setRankings(data);
    } catch (err) {
      console.error('Failed to load rankings', err);
    }
    setLoading(false);
  };

  const handleMatchAll = async () => {
    if (!selectedJob || resumes.length === 0) return;
    setMatching(true);
    try {
      const resumeIds = resumes.map((r) => r.id);
      await matchBatch(resumeIds, Number(selectedJob));
      // Reload rankings
      const data = await getResults(Number(selectedJob));
      setRankings(data);
    } catch (err) {
      console.error('Batch matching failed', err);
    }
    setMatching(false);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">🏆 Candidate Rankings</h1>
        <p className="page-subtitle">View all candidates ranked by match score for a specific position</p>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0, minWidth: '250px' }}>
            <label className="form-label" htmlFor="ranking-job-select">Select Job Description</label>
            <select
              id="ranking-job-select"
              className="form-select"
              value={selectedJob}
              onChange={(e) => handleSelectJob(e.target.value)}
            >
              <option value="">-- Choose a job --</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
          <button
            id="match-all-btn"
            className="btn btn-primary"
            onClick={handleMatchAll}
            disabled={!selectedJob || resumes.length === 0 || matching}
          >
            {matching ? 'Matching...' : `🔄 Match All Resumes (${resumes.length})`}
          </button>
        </div>
      </div>

      {/* Stats */}
      {rankings && rankings.rankings?.length > 0 && (
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-value gradient">{rankings.rankings.length}</div>
            <div className="stat-label">Total Candidates</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              {rankings.rankings.filter((r) => r.prediction === 'Selected').length}
            </div>
            <div className="stat-label">Selected</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--danger)' }}>
              {rankings.rankings.filter((r) => r.prediction === 'Rejected').length}
            </div>
            <div className="stat-label">Rejected</div>
          </div>
          <div className="stat-card">
            <div className="stat-value gradient">
              {rankings.rankings.length > 0
                ? (rankings.rankings.reduce((sum, r) => sum + r.match_score, 0) / rankings.rankings.length).toFixed(0)
                : 0}%
            </div>
            <div className="stat-label">Avg Score</div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <div className="loading-text">Loading rankings...</div>
        </div>
      )}

      {matching && (
        <div className="loading-container">
          <div className="spinner" />
          <div className="loading-text loading-pulse">
            Matching all resumes... This may take a moment.
          </div>
        </div>
      )}

      {/* Rankings List */}
      {!loading && !matching && rankings && rankings.rankings?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {rankings.rankings.map((r) => (
            <div key={r.resume_id} className="ranking-card">
              <div className={`ranking-position rank-${r.rank <= 3 ? r.rank : 'other'}`}>
                {r.rank}
              </div>
              <div className="ranking-info">
                <div className="ranking-name">{r.candidate_name}</div>
                <div className="ranking-prediction" style={{ marginTop: '4px' }}>
                  <span className={`card-badge ${r.prediction === 'Selected' ? 'badge-success' : 'badge-danger'}`}>
                    {r.prediction}
                  </span>
                </div>
              </div>
              {/* Score Bar */}
              <div style={{ flex: 1, maxWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Match</span>
                  <span style={{ fontWeight: 700, color: getScoreColor(r.match_score) }}>{r.match_score}%</span>
                </div>
                <div className="feature-bar-track">
                  <div
                    className={`feature-bar-fill ${r.match_score >= 70 ? 'high' : r.match_score >= 50 ? 'medium' : 'low'}`}
                    style={{ width: `${r.match_score}%` }}
                  />
                </div>
              </div>
              <div className="ranking-score" style={{ color: getScoreColor(r.match_score), minWidth: '60px', textAlign: 'right' }}>
                {r.match_score}%
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !matching && (!rankings || rankings?.rankings?.length === 0) && selectedJob && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <div className="empty-title">No Rankings Yet</div>
          <div className="empty-subtitle">Click "Match All Resumes" to rank candidates for this position</div>
        </div>
      )}

      {!selectedJob && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <div className="empty-title">Select a Position</div>
          <div className="empty-subtitle">Choose a job description to view candidate rankings</div>
        </div>
      )}
    </div>
  );
}
