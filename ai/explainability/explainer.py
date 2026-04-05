"""
Explainability Engine Module
Generates human-readable explanations for AI screening decisions.
Implements feature contribution analysis and natural language summaries.
"""

import json


def generate_explanation(features: dict, match_score: float, prediction: str,
                         resume, job) -> dict:
    """
    Generate a comprehensive explanation for the screening decision.
    
    Args:
        features: Feature scores dict from feature extractor
        match_score: Final match percentage
        prediction: "Selected" or "Rejected"
        resume: Resume DB model instance
        job: JobDescription DB model instance
    
    Returns:
        Dict with matched_skills, missing_skills, strengths, weaknesses,
        feature_contributions, summary
    """
    matched_skills = features.get("matched_skills", [])
    missing_skills = features.get("missing_skills", [])

    # Feature contributions (how much each feature helped/hurt)
    feature_contributions = _compute_feature_contributions(features)

    # Generate human-readable summary
    summary = _generate_summary(
        features=features,
        match_score=match_score,
        prediction=prediction,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        resume=resume,
        job=job,
    )

    # Strengths and weaknesses from features
    strengths = []
    weaknesses = []

    for skill in matched_skills[:5]:
        strengths.append(f"+ {skill} skill matched")

    if features["experience_score"] >= 0.7:
        strengths.append("+ Sufficient work experience")
    elif features["experience_score"] < 0.4:
        weaknesses.append("- Insufficient experience")

    if features["education_score"] >= 0.7:
        strengths.append("+ Education requirement met")
    elif features["education_score"] < 0.4:
        weaknesses.append("- Education gap")

    if features["project_score"] >= 0.5:
        strengths.append("+ Relevant project experience found")
    else:
        weaknesses.append("- Limited project relevance")

    for skill in missing_skills[:5]:
        weaknesses.append(f"- Missing {skill}")

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "feature_contributions": feature_contributions,
        "summary": summary,
    }


def _compute_feature_contributions(features: dict) -> dict:
    """
    Compute each feature's contribution to the final score.
    Returns a dict mapping feature name → contribution description.
    """
    contributions = {}

    feature_labels = {
        "skill_score": ("Skills Match", 0.40),
        "experience_score": ("Experience Match", 0.25),
        "project_score": ("Project Relevance", 0.20),
        "education_score": ("Education Match", 0.15),
    }

    for key, (label, weight) in feature_labels.items():
        score = features.get(key, 0)
        weighted = score * weight
        impact = "positive" if score >= 0.5 else "negative"
        contributions[label] = {
            "score": round(score, 3),
            "weight": weight,
            "weighted_contribution": round(weighted, 3),
            "impact": impact,
            "description": _describe_score(label, score),
        }

    return contributions


def _describe_score(feature_name: str, score: float) -> str:
    """Generate a human-readable description for a feature score."""
    if score >= 0.8:
        quality = "Excellent"
    elif score >= 0.6:
        quality = "Good"
    elif score >= 0.4:
        quality = "Moderate"
    elif score >= 0.2:
        quality = "Low"
    else:
        quality = "Very Low"

    return f"{quality} {feature_name.lower()} ({round(score * 100)}%)"


def _generate_summary(features, match_score, prediction, matched_skills,
                       missing_skills, resume, job) -> str:
    """Generate a natural language summary of the screening decision."""
    candidate_name = resume.name or "The candidate"
    job_title = job.title or "the position"

    lines = []
    lines.append(
        f"{candidate_name} received a match score of {match_score}% "
        f"for {job_title} and is predicted to be {prediction}."
    )

    # Skills summary
    if matched_skills:
        top = ", ".join(matched_skills[:5])
        lines.append(f"Matched skills include: {top}.")

    if missing_skills:
        top = ", ".join(missing_skills[:5])
        lines.append(f"Missing required skills: {top}.")

    # Experience summary
    exp_score = features["experience_score"]
    resume_exp = resume.experience_years or 0
    if exp_score >= 0.7:
        lines.append(f"The candidate has {resume_exp} years of experience, meeting the job requirements.")
    elif resume_exp > 0:
        lines.append(f"The candidate has {resume_exp} years of experience, which partially meets the requirements.")
    else:
        lines.append("No specific experience duration was identified from the resume.")

    # Key factor
    scores = {
        "Skills": features["skill_score"],
        "Experience": features["experience_score"],
        "Projects": features["project_score"],
        "Education": features["education_score"],
    }
    top_factor = max(scores, key=scores.get)
    bottom_factor = min(scores, key=scores.get)

    lines.append(f"The strongest factor is {top_factor} ({round(scores[top_factor]*100)}%).")
    if scores[bottom_factor] < 0.5:
        lines.append(f"The weakest area is {bottom_factor} ({round(scores[bottom_factor]*100)}%).")

    return " ".join(lines)
