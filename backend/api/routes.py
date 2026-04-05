import json
import os
import uuid
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form
from sqlalchemy.orm import Session

from backend.core.config import UPLOAD_DIR, ALLOWED_EXTENSIONS, MAX_FILE_SIZE
from backend.core.database import get_db
from backend.models.models import Resume, JobDescription, ScreeningResult
from backend.schemas.schemas import (
    ResumeResponse,
    ResumeListResponse,
    JobDescriptionCreate,
    JobDescriptionResponse,
    JobListResponse,
    MatchRequest,
    MatchBatchRequest,
    ScreeningResultResponse,
    FeatureScores,
    ExplanationDetail,
    RankingResponse,
    RankingListResponse,
    CompareRequest,
    CompareResponse,
    CandidateComparison,
)

router = APIRouter(prefix="/api", tags=["HireLens AI"])


# ─── Resume Endpoints ───────────────────────────────────────

@router.post("/upload_resume", response_model=ResumeResponse)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload and parse a resume file (PDF, DOCX, or TXT)."""
    # Validate extension
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Unsupported file type: {ext}. Allowed: {ALLOWED_EXTENSIONS}")

    # Read file
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, f"File too large. Max {MAX_FILE_SIZE // (1024*1024)} MB.")

    # Save file
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / unique_name
    with open(file_path, "wb") as f:
        f.write(content)

    # Parse resume
    from ai.resume_parser.parser import parse_resume
    parsed = parse_resume(str(file_path), ext)

    # Store in DB
    resume = Resume(
        name=parsed.get("name", "Unknown"),
        email=parsed.get("email"),
        phone=parsed.get("phone"),
        skills=json.dumps(parsed.get("skills", [])),
        education=parsed.get("education"),
        experience_years=parsed.get("experience_years", 0),
        projects=json.dumps(parsed.get("projects", [])),
        certifications=json.dumps(parsed.get("certifications", [])),
        file_path=str(file_path),
        file_name=file.filename,
        raw_text=parsed.get("raw_text", ""),
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return ResumeResponse(
        id=resume.id,
        name=resume.name,
        email=resume.email,
        phone=resume.phone,
        skills=resume.skills_list,
        education=resume.education,
        experience_years=resume.experience_years,
        projects=resume.projects_list,
        certifications=resume.certifications_list,
        file_name=resume.file_name,
        created_at=resume.created_at,
    )


@router.get("/resumes", response_model=ResumeListResponse)
def list_resumes(db: Session = Depends(get_db)):
    """List all uploaded resumes."""
    resumes = db.query(Resume).order_by(Resume.created_at.desc()).all()
    items = []
    for r in resumes:
        items.append(ResumeResponse(
            id=r.id, name=r.name, email=r.email, phone=r.phone,
            skills=r.skills_list, education=r.education,
            experience_years=r.experience_years, projects=r.projects_list,
            certifications=r.certifications_list, file_name=r.file_name,
            created_at=r.created_at,
        ))
    return ResumeListResponse(resumes=items, total=len(items))


@router.delete("/resumes/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    """Delete a resume and its screening results."""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(404, "Resume not found")
    # Delete associated results
    db.query(ScreeningResult).filter(ScreeningResult.resume_id == resume_id).delete()
    # Delete file
    if resume.file_path and os.path.exists(resume.file_path):
        os.remove(resume.file_path)
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}


# ─── Job Description Endpoints ──────────────────────────────

@router.post("/upload_job", response_model=JobDescriptionResponse)
def upload_job(payload: JobDescriptionCreate, db: Session = Depends(get_db)):
    """Submit a job description for analysis."""
    from ai.job_parser.parser import parse_job_description
    parsed = parse_job_description(payload.description)

    job = JobDescription(
        title=payload.title,
        description=payload.description,
        skills_required=json.dumps(parsed.get("skills_required", [])),
        skills_preferred=json.dumps(parsed.get("skills_preferred", [])),
        experience_required=parsed.get("experience_required", 0),
        education_required=parsed.get("education_required"),
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    return JobDescriptionResponse(
        id=job.id, title=job.title, description=job.description,
        skills_required=job.skills_required_list,
        skills_preferred=job.skills_preferred_list,
        experience_required=job.experience_required,
        education_required=job.education_required,
        created_at=job.created_at,
    )


@router.get("/jobs", response_model=JobListResponse)
def list_jobs(db: Session = Depends(get_db)):
    """List all job descriptions."""
    jobs = db.query(JobDescription).order_by(JobDescription.created_at.desc()).all()
    items = []
    for j in jobs:
        items.append(JobDescriptionResponse(
            id=j.id, title=j.title, description=j.description,
            skills_required=j.skills_required_list,
            skills_preferred=j.skills_preferred_list,
            experience_required=j.experience_required,
            education_required=j.education_required,
            created_at=j.created_at,
        ))
    return JobListResponse(jobs=items, total=len(items))


@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    """Delete a job description and its screening results."""
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(404, "Job not found")
    db.query(ScreeningResult).filter(ScreeningResult.job_id == job_id).delete()
    db.delete(job)
    db.commit()
    return {"message": "Job description deleted successfully"}


# ─── Matching Endpoints ─────────────────────────────────────

@router.post("/match_resume", response_model=ScreeningResultResponse)
def match_resume(payload: MatchRequest, db: Session = Depends(get_db)):
    """Match a single resume against a job description."""
    resume = db.query(Resume).filter(Resume.id == payload.resume_id).first()
    if not resume:
        raise HTTPException(404, "Resume not found")

    job = db.query(JobDescription).filter(JobDescription.id == payload.job_id).first()
    if not job:
        raise HTTPException(404, "Job description not found")

    # Run matching pipeline
    from ai.matching_engine.matching import match_resume_to_job
    result = match_resume_to_job(resume, job)

    # Store result
    screening = ScreeningResult(
        resume_id=resume.id,
        job_id=job.id,
        match_score=result["match_score"],
        prediction=result["prediction"],
        probability=result["probability"],
        explanation=json.dumps(result["explanation"]),
        feature_scores=json.dumps(result["feature_scores"]),
        strengths=json.dumps(result["strengths"]),
        weaknesses=json.dumps(result["weaknesses"]),
        matched_skills=json.dumps(result["matched_skills"]),
        missing_skills=json.dumps(result["missing_skills"]),
    )
    db.add(screening)
    db.commit()
    db.refresh(screening)

    return _build_screening_response(screening, resume.name)


@router.post("/match_batch", response_model=List[ScreeningResultResponse])
def match_batch(payload: MatchBatchRequest, db: Session = Depends(get_db)):
    """Match multiple resumes against a job description."""
    job = db.query(JobDescription).filter(JobDescription.id == payload.job_id).first()
    if not job:
        raise HTTPException(404, "Job description not found")

    from ai.matching_engine.matching import match_resume_to_job

    results = []
    for rid in payload.resume_ids:
        resume = db.query(Resume).filter(Resume.id == rid).first()
        if not resume:
            continue

        result = match_resume_to_job(resume, job)

        screening = ScreeningResult(
            resume_id=resume.id,
            job_id=job.id,
            match_score=result["match_score"],
            prediction=result["prediction"],
            probability=result["probability"],
            explanation=json.dumps(result["explanation"]),
            feature_scores=json.dumps(result["feature_scores"]),
            strengths=json.dumps(result["strengths"]),
            weaknesses=json.dumps(result["weaknesses"]),
            matched_skills=json.dumps(result["matched_skills"]),
            missing_skills=json.dumps(result["missing_skills"]),
        )
        db.add(screening)
        db.commit()
        db.refresh(screening)

        results.append(_build_screening_response(screening, resume.name))

    return results


# ─── Results & Ranking ──────────────────────────────────────

@router.get("/results/{job_id}", response_model=RankingListResponse)
def get_results(job_id: int, db: Session = Depends(get_db)):
    """Get all screening results for a job, ranked by score."""
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(404, "Job description not found")

    screenings = (
        db.query(ScreeningResult)
        .filter(ScreeningResult.job_id == job_id)
        .order_by(ScreeningResult.match_score.desc())
        .all()
    )

    rankings = []
    for rank, s in enumerate(screenings, start=1):
        resume = db.query(Resume).filter(Resume.id == s.resume_id).first()
        rankings.append(RankingResponse(
            rank=rank,
            resume_id=s.resume_id,
            candidate_name=resume.name if resume else "Unknown",
            match_score=s.match_score,
            prediction=s.prediction,
        ))

    return RankingListResponse(job_id=job_id, job_title=job.title, rankings=rankings)


@router.get("/results/{job_id}/detail/{resume_id}", response_model=ScreeningResultResponse)
def get_result_detail(job_id: int, resume_id: int, db: Session = Depends(get_db)):
    """Get detailed screening result for a specific resume-job pair."""
    screening = (
        db.query(ScreeningResult)
        .filter(ScreeningResult.job_id == job_id, ScreeningResult.resume_id == resume_id)
        .order_by(ScreeningResult.created_at.desc())
        .first()
    )
    if not screening:
        raise HTTPException(404, "Screening result not found")

    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    return _build_screening_response(screening, resume.name if resume else "Unknown")


# ─── Comparison Endpoint ────────────────────────────────────

@router.post("/compare_resumes", response_model=CompareResponse)
def compare_resumes(payload: CompareRequest, db: Session = Depends(get_db)):
    """Compare two resumes against a job description."""
    resume_a = db.query(Resume).filter(Resume.id == payload.resume_id_a).first()
    resume_b = db.query(Resume).filter(Resume.id == payload.resume_id_b).first()
    job = db.query(JobDescription).filter(JobDescription.id == payload.job_id).first()

    if not resume_a or not resume_b:
        raise HTTPException(404, "One or both resumes not found")
    if not job:
        raise HTTPException(404, "Job description not found")

    from ai.comparison.comparator import compare_candidates
    comparison = compare_candidates(resume_a, resume_b, job)

    return CompareResponse(
        job_id=job.id,
        job_title=job.title,
        candidate_a=CandidateComparison(**comparison["candidate_a"]),
        candidate_b=CandidateComparison(**comparison["candidate_b"]),
        recommendation=comparison["recommendation"],
    )


# ─── Health Check ────────────────────────────────────────────

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "HireLens AI"}


# ─── Helpers ─────────────────────────────────────────────────

def _build_screening_response(screening: ScreeningResult, candidate_name: str) -> ScreeningResultResponse:
    """Convert a ScreeningResult DB row into a response schema."""
    feature_scores = json.loads(screening.feature_scores) if screening.feature_scores else {}
    explanation = json.loads(screening.explanation) if screening.explanation else {}
    matched = json.loads(screening.matched_skills) if screening.matched_skills else []
    missing = json.loads(screening.missing_skills) if screening.missing_skills else []
    strengths = json.loads(screening.strengths) if screening.strengths else []
    weaknesses = json.loads(screening.weaknesses) if screening.weaknesses else []

    return ScreeningResultResponse(
        id=screening.id,
        resume_id=screening.resume_id,
        job_id=screening.job_id,
        candidate_name=candidate_name,
        match_score=screening.match_score,
        prediction=screening.prediction,
        probability=screening.probability,
        feature_scores=FeatureScores(**feature_scores),
        explanation=ExplanationDetail(**explanation),
        matched_skills=matched,
        missing_skills=missing,
        strengths=strengths,
        weaknesses=weaknesses,
        created_at=screening.created_at,
    )
