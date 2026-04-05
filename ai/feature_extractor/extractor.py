"""
Feature Extractor Module
Converts resume + job description data into comparable feature scores.
Each feature is normalized to 0–1 range.
"""

import json
import re


def extract_features(resume, job) -> dict:
    """
    Extract feature scores comparing a resume to a job description.
    
    Args:
        resume: Resume DB model instance
        job: JobDescription DB model instance
    
    Returns:
        Dict with skill_score, experience_score, education_score,
        project_score, certification_score, matched_skills, missing_skills
    """
    resume_skills = _parse_json_field(resume.skills)
    job_skills = _parse_json_field(job.skills_required)
    job_preferred = _parse_json_field(job.skills_preferred)
    resume_projects = _parse_json_field(resume.projects)
    resume_certs = _parse_json_field(resume.certifications)

    # Normalize skills for comparison
    resume_skills_lower = {s.lower().strip() for s in resume_skills}
    job_skills_lower = {s.lower().strip() for s in job_skills}
    job_preferred_lower = {s.lower().strip() for s in job_preferred}

    all_job_skills = job_skills_lower | job_preferred_lower

    # ── Skill Score ──────────────────────────────────────────
    matched = resume_skills_lower & all_job_skills
    missing = all_job_skills - resume_skills_lower

    if all_job_skills:
        skill_score = len(matched) / len(all_job_skills)
    else:
        skill_score = 0.5  # No skills specified → neutral score

    # Get display names for matched/missing skills
    matched_display = [s for s in resume_skills if s.lower().strip() in matched]
    missing_display = [s for s in (list(job_skills) + list(job_preferred)) if s.lower().strip() in missing]

    # ── Experience Score ─────────────────────────────────────
    resume_exp = resume.experience_years or 0
    required_exp = job.experience_required or 0

    if required_exp > 0:
        exp_ratio = resume_exp / required_exp
        experience_score = min(exp_ratio, 1.0)  # Cap at 1.0
    else:
        experience_score = min(resume_exp / 3.0, 1.0) if resume_exp > 0 else 0.3

    # ── Education Score ──────────────────────────────────────
    education_score = _compute_education_score(
        resume.education or "",
        job.education_required or ""
    )

    # ── Project Relevance Score ──────────────────────────────
    project_score = _compute_project_score(resume_projects, all_job_skills, resume.raw_text or "")

    # ── Certification Score ──────────────────────────────────
    certification_score = _compute_certification_score(resume_certs, all_job_skills)

    return {
        "skill_score": round(skill_score, 3),
        "experience_score": round(experience_score, 3),
        "education_score": round(education_score, 3),
        "project_score": round(project_score, 3),
        "certification_score": round(certification_score, 3),
        "matched_skills": matched_display,
        "missing_skills": missing_display,
    }


def _parse_json_field(field) -> list:
    """Parse a JSON string field into a list."""
    if isinstance(field, list):
        return field
    if isinstance(field, str):
        try:
            result = json.loads(field)
            return result if isinstance(result, list) else []
        except (json.JSONDecodeError, TypeError):
            return []
    return []


def _compute_education_score(resume_education: str, required_education: str) -> float:
    """Compute education match score (0–1)."""
    edu_hierarchy = {
        "phd": 4, "doctorate": 4, "doctor": 4,
        "master": 3, "mba": 3, "m.tech": 3, "m.s": 3, "m.e": 3,
        "bachelor": 2, "b.tech": 2, "b.s": 2, "b.e": 2, "b.sc": 2, "b.a": 2,
        "associate": 1, "diploma": 1,
    }

    resume_level = 0
    required_level = 0
    resume_edu_lower = resume_education.lower()
    required_edu_lower = required_education.lower()

    for key, level in edu_hierarchy.items():
        if key in resume_edu_lower:
            resume_level = max(resume_level, level)
        if key in required_edu_lower:
            required_level = max(required_level, level)

    if required_level == 0:
        return 0.7 if resume_level > 0 else 0.5  # No requirement specified

    if resume_level >= required_level:
        return 1.0
    elif resume_level == required_level - 1:
        return 0.6
    else:
        return 0.3


def _compute_project_score(projects: list, job_skills: set, raw_text: str) -> float:
    """Compute project relevance score based on skill keyword overlap."""
    if not projects:
        return 0.2  # No projects listed

    if not job_skills:
        return 0.5  # No job skills to compare against

    # Check how many job skills appear in project descriptions
    project_text = " ".join(projects).lower()
    matches = sum(1 for skill in job_skills if skill in project_text)

    if job_skills:
        return min(matches / max(len(job_skills) * 0.3, 1), 1.0)

    return 0.3


def _compute_certification_score(certifications: list, job_skills: set) -> float:
    """Compute certification relevance score."""
    if not certifications:
        return 0.1

    if not job_skills:
        return 0.5 if certifications else 0.1

    cert_text = " ".join(certifications).lower()
    matches = sum(1 for skill in job_skills if skill in cert_text)

    return min(0.3 + (matches / max(len(job_skills), 1)) * 0.7, 1.0)
