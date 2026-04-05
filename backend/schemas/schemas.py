from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


# ─── Resume Schemas ──────────────────────────────────────────

class ResumeBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = []
    education: Optional[str] = None
    experience_years: float = 0
    projects: List[str] = []
    certifications: List[str] = []


class ResumeResponse(ResumeBase):
    id: int
    file_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ResumeListResponse(BaseModel):
    resumes: List[ResumeResponse]
    total: int


# ─── Job Description Schemas ────────────────────────────────

class JobDescriptionCreate(BaseModel):
    title: str
    description: str


class JobDescriptionResponse(BaseModel):
    id: int
    title: str
    description: str
    skills_required: List[str] = []
    skills_preferred: List[str] = []
    experience_required: float = 0
    education_required: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    jobs: List[JobDescriptionResponse]
    total: int


# ─── Matching Schemas ────────────────────────────────────────

class MatchRequest(BaseModel):
    resume_id: int
    job_id: int


class MatchBatchRequest(BaseModel):
    resume_ids: List[int]
    job_id: int


class FeatureScores(BaseModel):
    skill_score: float = 0.0
    experience_score: float = 0.0
    education_score: float = 0.0
    project_score: float = 0.0
    certification_score: float = 0.0
    semantic_score: float = 0.0


class ExplanationDetail(BaseModel):
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    feature_contributions: dict = {}
    summary: str = ""


class ScreeningResultResponse(BaseModel):
    id: int
    resume_id: int
    job_id: int
    candidate_name: Optional[str] = None
    match_score: float
    prediction: str
    probability: float
    feature_scores: FeatureScores
    explanation: ExplanationDetail
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True


class RankingResponse(BaseModel):
    rank: int
    resume_id: int
    candidate_name: Optional[str] = None
    match_score: float
    prediction: str


class RankingListResponse(BaseModel):
    job_id: int
    job_title: str
    rankings: List[RankingResponse]


# ─── Comparison Schemas ──────────────────────────────────────

class CompareRequest(BaseModel):
    resume_id_a: int
    resume_id_b: int
    job_id: int


class CandidateComparison(BaseModel):
    resume_id: int
    candidate_name: Optional[str] = None
    match_score: float
    prediction: str
    skills_coverage: float
    experience_relevance: float
    project_relevance: float
    education_match: float
    pros: List[str] = []
    cons: List[str] = []
    matched_skills: List[str] = []
    missing_skills: List[str] = []


class CompareResponse(BaseModel):
    job_id: int
    job_title: str
    candidate_a: CandidateComparison
    candidate_b: CandidateComparison
    recommendation: str
