import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

// ─── Resume APIs ──────────────────────────────────────────

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/upload_resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getResumes = async () => {
  const { data } = await api.get('/resumes');
  return data;
};

export const deleteResume = async (resumeId) => {
  const { data } = await api.delete(`/resumes/${resumeId}`);
  return data;
};


// ─── Job APIs ─────────────────────────────────────────────

export const uploadJob = async (title, description) => {
  const { data } = await api.post('/upload_job', { title, description });
  return data;
};

export const getJobs = async () => {
  const { data } = await api.get('/jobs');
  return data;
};

export const deleteJob = async (jobId) => {
  const { data } = await api.delete(`/jobs/${jobId}`);
  return data;
};


// ─── Matching APIs ────────────────────────────────────────

export const matchResume = async (resumeId, jobId) => {
  const { data } = await api.post('/match_resume', {
    resume_id: resumeId,
    job_id: jobId,
  });
  return data;
};

export const matchBatch = async (resumeIds, jobId) => {
  const { data } = await api.post('/match_batch', {
    resume_ids: resumeIds,
    job_id: jobId,
  });
  return data;
};


// ─── Results & Ranking APIs ───────────────────────────────

export const getResults = async (jobId) => {
  const { data } = await api.get(`/results/${jobId}`);
  return data;
};

export const getResultDetail = async (jobId, resumeId) => {
  const { data } = await api.get(`/results/${jobId}/detail/${resumeId}`);
  return data;
};


// ─── Comparison API ───────────────────────────────────────

export const compareResumes = async (resumeIdA, resumeIdB, jobId) => {
  const { data } = await api.post('/compare_resumes', {
    resume_id_a: resumeIdA,
    resume_id_b: resumeIdB,
    job_id: jobId,
  });
  return data;
};

export default api;
