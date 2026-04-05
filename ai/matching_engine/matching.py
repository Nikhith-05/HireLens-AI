"""
Matching Engine Module
Calculates resume-job similarity using feature scoring and weighted combination.
Produces match score, prediction, and detailed explanation.
"""

import json
from ai.feature_extractor.extractor import extract_features
from ai.explainability.explainer import generate_explanation
from backend.core.config import MATCHING_WEIGHTS, SELECTION_THRESHOLD


def match_resume_to_job(resume, job) -> dict:
    """
    Match a resume against a job description.
    
    Args:
        resume: Resume DB model instance
        job: JobDescription DB model instance
    
    Returns:
        Dict with match_score, prediction, probability, feature_scores,
        explanation, strengths, weaknesses, matched_skills, missing_skills
    """
    # Step 1: Extract features
    features = extract_features(resume, job)

    # Step 2: Compute weighted score
    weights = MATCHING_WEIGHTS
    weighted_score = (
        weights["skill_score"] * features["skill_score"] +
        weights["experience_score"] * features["experience_score"] +
        weights["project_score"] * features["project_score"] +
        weights["education_score"] * features["education_score"]
    )

    # Bonus for certifications (up to 5% boost)
    cert_bonus = features.get("certification_score", 0) * 0.05
    final_score = min(weighted_score + cert_bonus, 1.0)
    match_percentage = round(final_score * 100, 1)

    # Step 3: Prediction
    threshold = SELECTION_THRESHOLD
    prediction = "Selected" if final_score >= threshold else "Rejected"
    probability = round(final_score, 3)

    # Step 4: Generate explanation
    explanation = generate_explanation(
        features=features,
        match_score=match_percentage,
        prediction=prediction,
        resume=resume,
        job=job,
    )

    # Step 5: Compute strengths and weaknesses
    strengths, weaknesses = _compute_strengths_weaknesses(features, resume, job)

    return {
        "match_score": match_percentage,
        "prediction": prediction,
        "probability": probability,
        "feature_scores": {
            "skill_score": features["skill_score"],
            "experience_score": features["experience_score"],
            "education_score": features["education_score"],
            "project_score": features["project_score"],
            "certification_score": features.get("certification_score", 0),
            "semantic_score": 0.0,  # Placeholder for semantic scoring
        },
        "explanation": explanation,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "matched_skills": features.get("matched_skills", []),
        "missing_skills": features.get("missing_skills", []),
    }


def _compute_strengths_weaknesses(features: dict, resume, job) -> tuple:
    """Generate human-readable strengths and weaknesses."""
    strengths = []
    weaknesses = []

    # Skill analysis
    skill_score = features["skill_score"]
    matched = features.get("matched_skills", [])
    missing = features.get("missing_skills", [])

    if skill_score >= 0.8:
        strengths.append(f"Strong skill coverage ({len(matched)} matched skills)")
    elif skill_score >= 0.5:
        strengths.append(f"Moderate skill coverage ({len(matched)} matched)")
    else:
        weaknesses.append(f"Low skill coverage (only {len(matched)} matched)")

    if matched:
        top_skills = ", ".join(matched[:5])
        strengths.append(f"Key skills matched: {top_skills}")

    if missing:
        top_missing = ", ".join(missing[:5])
        weaknesses.append(f"Missing skills: {top_missing}")

    # Experience analysis
    exp_score = features["experience_score"]
    resume_exp = resume.experience_years or 0
    required_exp = job.experience_required or 0

    if exp_score >= 0.9:
        strengths.append(f"Meets experience requirement ({resume_exp}+ years)")
    elif exp_score >= 0.6:
        strengths.append(f"Partially meets experience ({resume_exp} years vs {required_exp} required)")
    elif required_exp > 0:
        weaknesses.append(f"Insufficient experience ({resume_exp} years vs {required_exp} required)")

    # Education analysis
    edu_score = features["education_score"]
    if edu_score >= 0.8:
        strengths.append("Education requirements met")
    elif edu_score < 0.5:
        weaknesses.append("Education level does not meet requirements")

    # Project analysis
    proj_score = features["project_score"]
    if proj_score >= 0.6:
        strengths.append("Relevant project experience")
    elif proj_score < 0.3:
        weaknesses.append("Limited relevant project experience")

    # Certification analysis
    cert_score = features.get("certification_score", 0)
    if cert_score >= 0.5:
        strengths.append("Relevant certifications present")
    elif cert_score < 0.2:
        weaknesses.append("No relevant certifications")

    return strengths, weaknesses
