import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadResume, uploadJob, getResumes, getJobs, matchResume, matchBatch } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import FeatureBars from '../components/FeatureBars';
import ExplanationPanel from '../components/ExplanationPanel';
import SkillTags from '../components/SkillTags';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [uploadedJob, setUploadedJob] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1=upload, 2=job, 3=result

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleUploadResume = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const resume = await uploadResume(file);
      setUploadedResume(resume);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume');
    }
    setLoading(false);
  };

  const handleUploadJob = async () => {
    if (!jobTitle.trim() || !jobDesc.trim()) return;
    setLoading(true);
    setError('');
    try {
      const job = await uploadJob(jobTitle, jobDesc);
      setUploadedJob(job);
      // Auto-match
      const matchResult = await matchResume(uploadedResume.id, job.id);
      setResult(matchResult);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process');
    }
    setLoading(false);
  };

  const handleStartOver = () => {
    setFile(null);
    setJobTitle('');
    setJobDesc('');
    setUploadedResume(null);
    setUploadedJob(null);
    setResult(null);
    setStep(1);
    setError('');
  };

  return (
    <div className="fade-in">
      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { num: 1, label: 'Upload Resume' },
          { num: 2, label: 'Job Description' },
          { num: 3, label: 'Results' },
        ].map((s, i) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem',
              fontWeight: 700,
              background: step >= s.num ? 'var(--gradient-primary)' : 'var(--bg-card)',
              color: step >= s.num ? 'white' : 'var(--text-muted)',
              border: step >= s.num ? 'none' : '1px solid var(--border)',
            }}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span style={{
              fontSize: '0.85rem', fontWeight: 600,
              color: step >= s.num ? 'var(--text-primary)' : 'var(--text-muted)',
            }}>{s.label}</span>
            {i < 2 && <div style={{
              width: 40, height: 2,
              background: step > s.num ? 'var(--accent-primary)' : 'var(--border)',
              margin: '0 0.5rem',
            }} />}
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 'var(--radius-sm)',
          background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)',
          color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.9rem',
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Step 1: Upload Resume */}
      {step === 1 && (
        <div className="card scale-in">
          <div className="card-header">
            <h2 className="card-title">📄 Upload Resume</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Supported: PDF, DOCX, TXT
            </span>
          </div>

          <div {...getRootProps()} className={`upload-zone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} id="resume-upload-input" />
            <div className="upload-icon">📁</div>
            <div className="upload-title">
              {isDragActive ? 'Drop your resume here...' : 'Drag & drop your resume'}
            </div>
            <div className="upload-subtitle">
              or <span className="upload-highlight">click to browse</span> files
            </div>
          </div>

          {file && (
            <div className="file-preview">
              <div className="file-icon">📄</div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                ✕
              </button>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              id="upload-resume-btn"
              className="btn btn-primary btn-lg"
              onClick={handleUploadResume}
              disabled={!file || loading}
            >
              {loading ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing...</>
              ) : (
                <>Upload & Parse →</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Job Description */}
      {step === 2 && (
        <div className="scale-in">
          {/* Resume Summary */}
          {uploadedResume && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h3 className="card-title">✅ Resume Parsed: {uploadedResume.name}</h3>
                <span className="card-badge badge-success">Parsed</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                {uploadedResume.email && <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> {uploadedResume.email}</div>}
                {uploadedResume.experience_years > 0 && <div><span style={{ color: 'var(--text-muted)' }}>Experience:</span> {uploadedResume.experience_years} years</div>}
                {uploadedResume.education && <div><span style={{ color: 'var(--text-muted)' }}>Education:</span> {uploadedResume.education}</div>}
              </div>
              {uploadedResume.skills?.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>DETECTED SKILLS</div>
                  <SkillTags skills={uploadedResume.skills} type="matched" />
                </div>
              )}
            </div>
          )}

          {/* Job Description Form */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">💼 Enter Job Description</h2>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="job-title-input">Job Title</label>
              <input
                id="job-title-input"
                className="form-input"
                type="text"
                placeholder="e.g. Senior Python Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="job-desc-input">Job Description</label>
              <textarea
                id="job-desc-input"
                className="form-textarea"
                placeholder="Paste the full job description here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={8}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                id="analyze-match-btn"
                className="btn btn-primary btn-lg"
                onClick={handleUploadJob}
                disabled={!jobTitle.trim() || !jobDesc.trim() || loading}
              >
                {loading ? (
                  <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing...</>
                ) : (
                  <>Analyze Match →</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && result && (
        <div className="scale-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 className="page-title">Screening Results</h2>
              <p className="page-subtitle">
                {result.candidate_name} → {uploadedJob?.title}
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleStartOver}>
              + New Screening
            </button>
          </div>

          {/* Score + Prediction Row */}
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="card" style={{ display: 'flex', justifyContent: 'center' }}>
              <ScoreGauge score={result.match_score} label="Match Score" />
            </div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                fontSize: '1.5rem', fontWeight: 800,
                color: result.prediction === 'Selected' ? 'var(--success)' : 'var(--danger)',
                marginBottom: '0.5rem',
              }}>
                {result.prediction === 'Selected' ? '✅' : '❌'} {result.prediction}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Confidence: {(result.probability * 100).toFixed(0)}%
              </div>
            </div>
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '1rem' }}>Feature Scores</h3>
              <FeatureBars scores={result.feature_scores} />
            </div>
          </div>

          {/* Skills + Explanation Row */}
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '1rem' }}>🎯 Skills Analysis</h3>
              {result.matched_skills?.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>MATCHED SKILLS</div>
                  <SkillTags skills={result.matched_skills} type="matched" />
                </div>
              )}
              {result.missing_skills?.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>MISSING SKILLS</div>
                  <SkillTags skills={result.missing_skills} type="missing" />
                </div>
              )}
            </div>
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '1rem' }}>💡 Explanation</h3>
              <ExplanationPanel explanation={result.explanation} />
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid-2">
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '1rem', color: 'var(--success)' }}>💪 Strengths</h3>
              {result.strengths?.map((s, i) => (
                <div key={i} className="explanation-item positive">
                  <span className="explanation-icon">✓</span>
                  <span>{s}</span>
                </div>
              ))}
              {(!result.strengths || result.strengths.length === 0) && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No specific strengths identified</div>
              )}
            </div>
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '1rem', color: 'var(--danger)' }}>⚠ Weaknesses</h3>
              {result.weaknesses?.map((w, i) => (
                <div key={i} className="explanation-item negative">
                  <span className="explanation-icon">✗</span>
                  <span>{w}</span>
                </div>
              ))}
              {(!result.weaknesses || result.weaknesses.length === 0) && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No significant weaknesses found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
