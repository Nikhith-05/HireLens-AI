import { useState, useEffect } from 'react';
import { getJobs, getResumes, getResults, getResultDetail } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import FeatureBars from '../components/FeatureBars';
import ExplanationPanel from '../components/ExplanationPanel';
import SkillTags from '../components/SkillTags';

export default function ResultsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [rankings, setRankings] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error('Failed to load jobs', err);
    }
  };

  const handleSelectJob = async (jobId) => {
    setLoading(true);
    setSelectedJob(jobId);
    setSelectedResult(null);
    try {
      const data = await getResults(jobId);
      setRankings(data);
    } catch (err) {
      console.error('Failed to load results', err);
    }
    setLoading(false);
  };

  const handleSelectCandidate = async (resumeId) => {
    setLoading(true);
    try {
      const data = await getResultDetail(selectedJob, resumeId);
      setSelectedResult(data);
    } catch (err) {
      console.error('Failed to load result detail', err);
    }
    setLoading(false);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">📊 Screening Results</h1>
        <p className="page-subtitle">View detailed analysis for each resume-job match</p>
      </div>

      {/* Job Selector */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="results-job-select">Select Job Description</label>
          <select
            id="results-job-select"
            className="form-select"
            value={selectedJob || ''}
            onChange={(e) => handleSelectJob(Number(e.target.value))}
          >
            <option value="">-- Choose a job --</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <div className="loading-text">Loading results...</div>
        </div>
      )}

      {!loading && !selectedJob && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">Select a Job Description</div>
          <div className="empty-subtitle">Choose a job from the dropdown above to view screening results</div>
        </div>
      )}

      {!loading && selectedJob && rankings && (
        <div className="grid-2">
          {/* Left: Candidate List */}
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
              Candidates ({rankings.rankings?.length || 0})
            </h3>
            {rankings.rankings?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {rankings.rankings.map((r) => (
                  <div
                    key={r.resume_id}
                    className="ranking-card"
                    onClick={() => handleSelectCandidate(r.resume_id)}
                    style={{
                      borderColor: selectedResult?.resume_id === r.resume_id ? 'var(--accent-primary)' : undefined,
                    }}
                  >
                    <div className={`ranking-position rank-${r.rank <= 3 ? r.rank : 'other'}`}>
                      #{r.rank}
                    </div>
                    <div className="ranking-info">
                      <div className="ranking-name">{r.candidate_name}</div>
                      <div className="ranking-prediction">
                        <span className={`card-badge ${r.prediction === 'Selected' ? 'badge-success' : 'badge-danger'}`}>
                          {r.prediction}
                        </span>
                      </div>
                    </div>
                    <div className="ranking-score" style={{
                      color: r.match_score >= 70 ? 'var(--success)' : r.match_score >= 50 ? 'var(--warning)' : 'var(--danger)',
                    }}>
                      {r.match_score}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No Results Yet</div>
                <div className="empty-subtitle">Upload resumes and run matching from the Upload page</div>
              </div>
            )}
          </div>

          {/* Right: Detailed View */}
          <div>
            {selectedResult ? (
              <div className="slide-in">
                <div className="card" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <ScoreGauge score={selectedResult.match_score} size={100} label="Score" />
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedResult.candidate_name}</h3>
                      <div style={{
                        fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem',
                        color: selectedResult.prediction === 'Selected' ? 'var(--success)' : 'var(--danger)',
                      }}>
                        {selectedResult.prediction === 'Selected' ? '✅' : '❌'} {selectedResult.prediction}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.95rem' }}>Feature Scores</h4>
                  <FeatureBars scores={selectedResult.feature_scores} />
                </div>

                <div className="card" style={{ marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.95rem' }}>Skills</h4>
                  {selectedResult.matched_skills?.length > 0 && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>MATCHED</div>
                      <SkillTags skills={selectedResult.matched_skills} type="matched" />
                    </div>
                  )}
                  {selectedResult.missing_skills?.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>MISSING</div>
                      <SkillTags skills={selectedResult.missing_skills} type="missing" />
                    </div>
                  )}
                </div>

                <div className="card">
                  <h4 style={{ marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.95rem' }}>Explanation</h4>
                  <ExplanationPanel explanation={selectedResult.explanation} />
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '3rem' }}>
                <div className="empty-icon">👈</div>
                <div className="empty-title">Select a Candidate</div>
                <div className="empty-subtitle">Click on a candidate to see detailed results</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
