"""
Job Description Parser Module
Extracts structured requirements from job description text.
Uses keyword matching and pattern recognition.
"""

import re


# Comprehensive skill keywords for detection
TECH_SKILLS = {
    "python", "java", "javascript", "typescript", "c++", "c#", "c", "ruby", "go",
    "golang", "rust", "swift", "kotlin", "php", "scala", "r", "matlab",
    "react", "reactjs", "angular", "vue", "vuejs", "django", "flask", "fastapi",
    "express", "next.js", "nextjs", "spring", "spring boot", "rails",
    "node.js", "nodejs", "asp.net", "laravel",
    "machine learning", "deep learning", "ai", "ml", "nlp",
    "natural language processing", "computer vision", "tensorflow", "pytorch",
    "keras", "scikit-learn", "pandas", "numpy",
    "data science", "data analysis", "data engineering",
    "sql", "mysql", "postgresql", "mongodb", "redis", "sqlite",
    "elasticsearch", "dynamodb", "cassandra", "oracle",
    "aws", "amazon web services", "azure", "gcp", "google cloud",
    "docker", "kubernetes", "k8s", "jenkins", "ci/cd", "terraform", "ansible",
    "linux", "unix", "git", "github", "gitlab",
    "rest api", "graphql", "microservices", "api",
    "html", "css", "sass", "bootstrap", "tailwind",
    "agile", "scrum", "jira",
    "android", "ios", "react native", "flutter",
    "unit testing", "selenium", "jest", "pytest",
    "power bi", "tableau", "excel",
    "blockchain", "iot", "embedded systems",
}


def parse_job_description(text: str) -> dict:
    """
    Parse job description text and extract structured requirements.
    
    Args:
        text: Raw job description text
    
    Returns:
        Dict with skills_required, skills_preferred, experience_required,
        education_required
    """
    text_lower = text.lower()

    return {
        "skills_required": _extract_required_skills(text_lower, text),
        "skills_preferred": _extract_preferred_skills(text_lower, text),
        "experience_required": _extract_required_experience(text_lower),
        "education_required": _extract_required_education(text_lower),
    }


def _extract_required_skills(text_lower: str, original_text: str) -> list:
    """Extract required/must-have skills from job description."""
    found_skills = set()

    # Sort by length to match multi-word skills first
    sorted_skills = sorted(TECH_SKILLS, key=len, reverse=True)

    for skill in sorted_skills:
        if len(skill.split()) == 1:
            pattern = r"\b" + re.escape(skill) + r"\b"
        else:
            pattern = re.escape(skill)

        if re.search(pattern, text_lower):
            display = skill.title() if len(skill) > 3 else skill.upper()
            found_skills.add(display)

    # Check for "required"/"must have" context — if a skill appears near
    # requirement language, it's a required skill
    required_context = re.findall(
        r"(?:required|must have|must-have|mandatory|essential|need|needs)[:\s]*(.{0,300})",
        text_lower
    )

    # All found skills are treated as required for simplicity
    return sorted(found_skills)


def _extract_preferred_skills(text_lower: str, original_text: str) -> list:
    """Extract preferred/nice-to-have skills from job description."""
    preferred_context = re.findall(
        r"(?:preferred|nice to have|nice-to-have|bonus|plus|advantag\w+|desir\w+)[:\s]*(.{0,300})",
        text_lower
    )

    if not preferred_context:
        return []

    combined = " ".join(preferred_context)
    found = set()
    sorted_skills = sorted(TECH_SKILLS, key=len, reverse=True)

    for skill in sorted_skills:
        if len(skill.split()) == 1:
            pattern = r"\b" + re.escape(skill) + r"\b"
        else:
            pattern = re.escape(skill)

        if re.search(pattern, combined):
            display = skill.title() if len(skill) > 3 else skill.upper()
            found.add(display)

    return sorted(found)


def _extract_required_experience(text_lower: str) -> float:
    """Extract required years of experience."""
    patterns = [
        r"(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)",
        r"(?:minimum|min|at least)\s*(\d+)\s*(?:years?|yrs?)",
        r"(\d+)\+?\s*(?:years?|yrs?)\s*(?:relevant|professional|industry|work)",
        r"(?:experience|exp)[:\s]*(\d+)\+?\s*(?:years?|yrs?)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            return float(match.group(1))

    return 0


def _extract_required_education(text_lower: str) -> str:
    """Extract required education level."""
    education_levels = [
        (r"(?:ph\.?d|doctorate|doctor)", "PhD"),
        (r"(?:master'?s?|m\.?s\.?|m\.?tech|m\.?e\.?|mba)", "Master's"),
        (r"(?:bachelor'?s?|b\.?s\.?|b\.?tech|b\.?e\.?|b\.?a\.?|b\.?sc)", "Bachelor's"),
        (r"(?:associate'?s?|diploma)", "Associate's/Diploma"),
    ]

    for pattern, level in education_levels:
        if re.search(pattern, text_lower):
            return level

    return None
