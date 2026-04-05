"""
Resume Comparison Engine Module
Compares two candidates for the same role with detailed pros/cons analysis.
"""

import json
from ai.feature_extractor.extractor import extract_features
from ai.matching_engine.matching import match_resume_to_job


def compare_candidates(resume_a, resume_b, job) -> dict:
    """
    Compare two candidates against a job description.
    
    Args:
        resume_a: First Resume DB model instance
        resume_b: Second Resume DB model instance
        job: JobDescription DB model instance
    
    Returns:
        Dict with candidate_a, candidate_b comparisons and recommendation
    """
    # Get match results for both candidates
    result_a = match_resume_to_job(resume_a, job)
    result_b = match_resume_to_job(resume_b, job)

    features_a = extract_features(resume_a, job)
    features_b = extract_features(resume_b, job)

    # Generate pros/cons for each candidate
    pros_a, cons_a = _generate_pros_cons(features_a, resume_a, job, "A")
    pros_b, cons_b = _generate_pros_cons(features_b, resume_b, job, "B")

    # Generate recommendation
    recommendation = _generate_recommendation(
        result_a, result_b, resume_a, resume_b
    )

    return {
        "candidate_a": {
            "resume_id": resume_a.id,
            "candidate_name": resume_a.name or "Candidate A",
            "match_score": result_a["match_score"],
            "prediction": result_a["prediction"],
            "skills_coverage": features_a["skill_score"],
            "experience_relevance": features_a["experience_score"],
            "project_relevance": features_a["project_score"],
            "education_match": features_a["education_score"],
            "pros": pros_a,
            "cons": cons_a,
            "matched_skills": result_a["matched_skills"],
            "missing_skills": result_a["missing_skills"],
        },
        "candidate_b": {
            "resume_id": resume_b.id,
            "candidate_name": resume_b.name or "Candidate B",
            "match_score": result_b["match_score"],
            "prediction": result_b["prediction"],
            "skills_coverage": features_b["skill_score"],
            "experience_relevance": features_b["experience_score"],
            "project_relevance": features_b["project_score"],
            "education_match": features_b["education_score"],
            "pros": pros_b,
            "cons": cons_b,
            "matched_skills": result_b["matched_skills"],
            "missing_skills": result_b["missing_skills"],
        },
        "recommendation": recommendation,
    }


def _generate_pros_cons(features: dict, resume, job, label: str) -> tuple:
    """Generate pros and cons for a candidate."""
    pros = []
    cons = []

    resume_skills = _parse_json(resume.skills)
    resume_projects = _parse_json(resume.projects)
    resume_certs = _parse_json(resume.certifications)

    # Skills analysis
    matched = features.get("matched_skills", [])
    missing = features.get("missing_skills", [])

    if features["skill_score"] >= 0.7:
        pros.append(f"Strong skill coverage ({round(features['skill_score']*100)}%)")
        if matched:
            pros.append(f"Key matching skills: {', '.join(matched[:4])}")
    elif features["skill_score"] >= 0.4:
        pros.append(f"Moderate skill coverage ({round(features['skill_score']*100)}%)")
    else:
        cons.append(f"Low skill coverage ({round(features['skill_score']*100)}%)")

    if missing:
        cons.append(f"Missing skills: {', '.join(missing[:4])}")

    # Experience
    exp = resume.experience_years or 0
    req_exp = job.experience_required or 0
    if features["experience_score"] >= 0.8:
        pros.append(f"{exp}+ years of relevant experience")
    elif features["experience_score"] < 0.5 and req_exp > 0:
        cons.append(f"Only {exp} years experience (need {req_exp})")

    # Projects
    if features["project_score"] >= 0.5:
        if resume_projects:
            pros.append(f"Relevant project experience ({len(resume_projects)} projects)")
    else:
        cons.append("Limited relevant project experience")

    # Education
    if features["education_score"] >= 0.8:
        if resume.education:
            pros.append(f"Good academic background: {resume.education[:60]}")
    elif features["education_score"] < 0.5:
        cons.append("Education level doesn't meet requirements")

    # Certifications
    if features.get("certification_score", 0) >= 0.3:
        if resume_certs:
            pros.append(f"Relevant certifications: {', '.join(resume_certs[:3])}")
    elif not resume_certs:
        cons.append("No certifications listed")

    return pros, cons


def _generate_recommendation(result_a, result_b, resume_a, resume_b) -> str:
    """Generate a recommendation comparing the two candidates."""
    name_a = resume_a.name or "Candidate A"
    name_b = resume_b.name or "Candidate B"
    score_a = result_a["match_score"]
    score_b = result_b["match_score"]

    diff = abs(score_a - score_b)

    if diff < 5:
        return (
            f"Both candidates are closely matched. {name_a} scored {score_a}% "
            f"and {name_b} scored {score_b}%. Review their specific strengths "
            f"and weaknesses to make a final decision."
        )
    elif score_a > score_b:
        return (
            f"{name_a} is the stronger candidate with a score of {score_a}% "
            f"compared to {name_b}'s {score_b}%. "
            f"{name_a} shows better overall alignment with the job requirements."
        )
    else:
        return (
            f"{name_b} is the stronger candidate with a score of {score_b}% "
            f"compared to {name_a}'s {score_a}%. "
            f"{name_b} shows better overall alignment with the job requirements."
        )


def _parse_json(field) -> list:
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
