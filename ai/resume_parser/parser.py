"""
Resume Parser Module
Extracts structured data from PDF, DOCX, and TXT resume files.
Uses regex patterns and heuristics for section detection.
"""

import re
from pathlib import Path


def parse_resume(file_path: str, ext: str = None) -> dict:
    """
    Parse a resume file and return structured data.
    
    Args:
        file_path: Path to the resume file
        ext: File extension (auto-detected if not provided)
    
    Returns:
        Dict with name, email, phone, skills, education, experience_years,
        projects, certifications, raw_text
    """
    if ext is None:
        ext = Path(file_path).suffix.lower()

    # Extract raw text
    if ext == ".pdf":
        raw_text = _extract_pdf(file_path)
    elif ext == ".docx":
        raw_text = _extract_docx(file_path)
    elif ext == ".txt":
        raw_text = _extract_txt(file_path)
    else:
        raw_text = _extract_txt(file_path)

    # Parse structured fields
    return {
        "name": _extract_name(raw_text),
        "email": _extract_email(raw_text),
        "phone": _extract_phone(raw_text),
        "skills": _extract_skills(raw_text),
        "education": _extract_education(raw_text),
        "experience_years": _extract_experience_years(raw_text),
        "projects": _extract_projects(raw_text),
        "certifications": _extract_certifications(raw_text),
        "raw_text": raw_text,
    }


# ─── Text Extraction ────────────────────────────────────────

def _extract_pdf(file_path: str) -> str:
    """Extract text from PDF using pdfplumber."""
    try:
        import pdfplumber
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""


def _extract_docx(file_path: str) -> str:
    """Extract text from DOCX using python-docx."""
    try:
        from docx import Document
        doc = Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
        return text.strip()
    except Exception as e:
        print(f"DOCX extraction error: {e}")
        return ""


def _extract_txt(file_path: str) -> str:
    """Read plain text file."""
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read().strip()
    except Exception as e:
        print(f"TXT extraction error: {e}")
        return ""


# ─── Field Extraction ───────────────────────────────────────

def _extract_name(text: str) -> str:
    """Extract candidate name from resume text (first non-empty line heuristic)."""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if not lines:
        return "Unknown"

    # The name is usually the first line of a resume
    first_line = lines[0]

    # Skip if it looks like a section header
    headers = ["resume", "curriculum vitae", "cv", "objective", "summary", "profile"]
    if first_line.lower() in headers:
        if len(lines) > 1:
            return lines[1][:80]

    # Skip if first line contains an email or phone
    if "@" in first_line or re.search(r"\d{10}", first_line):
        if len(lines) > 1:
            return lines[1][:80]

    return first_line[:80]


def _extract_email(text: str) -> str:
    """Extract email address."""
    match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    return match.group(0) if match else None


def _extract_phone(text: str) -> str:
    """Extract phone number."""
    patterns = [
        r"\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}",
        r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}",
        r"\d{10,12}",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0).strip()
    return None


# ─── Skills Extraction ──────────────────────────────────────

# Comprehensive skill list for matching
KNOWN_SKILLS = {
    # Programming languages
    "python", "java", "javascript", "typescript", "c++", "c#", "c", "ruby", "go",
    "golang", "rust", "swift", "kotlin", "php", "scala", "r", "matlab", "perl",
    "dart", "lua", "haskell", "elixir", "clojure", "groovy",
    # Web frameworks
    "react", "reactjs", "react.js", "angular", "angularjs", "vue", "vuejs", "vue.js",
    "django", "flask", "fastapi", "express", "expressjs", "next.js", "nextjs",
    "nuxt.js", "nuxtjs", "spring", "spring boot", "rails", "ruby on rails",
    "asp.net", "laravel", "svelte", "gatsby",
    # Data & AI/ML
    "machine learning", "deep learning", "artificial intelligence", "ai", "ml",
    "natural language processing", "nlp", "computer vision", "tensorflow", "pytorch",
    "keras", "scikit-learn", "sklearn", "pandas", "numpy", "scipy", "matplotlib",
    "seaborn", "opencv", "spacy", "nltk", "hugging face", "transformers",
    "data science", "data analysis", "data engineering", "data visualization",
    "big data", "statistics", "neural networks",
    # Databases
    "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "sqlite",
    "oracle", "cassandra", "dynamodb", "elasticsearch", "neo4j", "firebase",
    "mariadb", "couchdb",
    # Cloud & DevOps
    "aws", "amazon web services", "azure", "gcp", "google cloud", "docker",
    "kubernetes", "k8s", "jenkins", "ci/cd", "terraform", "ansible", "linux",
    "unix", "git", "github", "gitlab", "bitbucket", "nginx", "apache",
    "heroku", "vercel", "netlify", "cloudflare",
    # Tools & Technologies
    "rest api", "rest apis", "graphql", "websocket", "microservices",
    "api", "json", "xml", "html", "css", "sass", "less", "bootstrap",
    "tailwind", "tailwind css", "webpack", "babel", "npm", "yarn",
    "agile", "scrum", "jira", "confluence", "trello",
    "power bi", "tableau", "excel", "word",
    # Mobile
    "android", "ios", "react native", "flutter", "xamarin", "ionic",
    # Testing
    "unit testing", "integration testing", "selenium", "jest", "mocha",
    "pytest", "junit", "cypress", "playwright",
    # Other
    "blockchain", "iot", "embedded systems", "robotics", "ar", "vr",
    "game development", "unity", "unreal engine",
}


def _extract_skills(text: str) -> list:
    """Extract skills from resume text by matching known skills."""
    text_lower = text.lower()
    found_skills = []

    # Sort skills by length (longest first) to match multi-word skills first
    sorted_skills = sorted(KNOWN_SKILLS, key=len, reverse=True)

    for skill in sorted_skills:
        # Use word boundary matching for single-word skills
        if len(skill.split()) == 1:
            pattern = r"\b" + re.escape(skill) + r"\b"
        else:
            pattern = re.escape(skill)

        if re.search(pattern, text_lower):
            # Capitalize properly
            display_skill = skill.title() if len(skill) > 3 else skill.upper()
            if display_skill not in found_skills:
                found_skills.append(display_skill)

    return found_skills[:30]  # Cap at 30 skills


def _extract_education(text: str) -> str:
    """Extract education information."""
    education_patterns = [
        r"(?:B\.?Tech|B\.?E\.?|Bachelor(?:'s)?|B\.?Sc\.?|B\.?A\.?|B\.?S\.?)[\s\w,.-]+",
        r"(?:M\.?Tech|M\.?E\.?|Master(?:'s)?|M\.?Sc\.?|M\.?A\.?|M\.?S\.?|MBA)[\s\w,.-]+",
        r"(?:Ph\.?D\.?|Doctorate|Doctor)[\s\w,.-]+",
        r"(?:Diploma|Associate(?:'s)?)[\s\w,.-]+",
    ]

    for pattern in education_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0).strip()[:200]

    # Try to find education section
    edu_section = _extract_section(text, ["education", "academic", "qualification"])
    if edu_section:
        return edu_section[:200]

    return None


def _extract_experience_years(text: str) -> float:
    """Extract years of experience."""
    patterns = [
        r"(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)",
        r"(?:experience|exp)[\s:]*(\d+)\+?\s*(?:years?|yrs?)",
        r"(\d+)\+?\s*(?:years?|yrs?)\s*(?:in|of)\s*(?:industry|work|professional)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return float(match.group(1))

    # Count work experience entries to estimate
    work_entries = len(re.findall(
        r"(?:20\d{2}|19\d{2})\s*[-–—to]+\s*(?:20\d{2}|19\d{2}|present|current)",
        text, re.IGNORECASE
    ))
    if work_entries > 0:
        return float(work_entries)  # Rough estimate

    return 0


def _extract_projects(text: str) -> list:
    """Extract project names/descriptions."""
    project_section = _extract_section(text, ["projects", "project", "personal projects", "academic projects"])
    if not project_section:
        return []

    lines = [l.strip() for l in project_section.split("\n") if l.strip()]
    projects = []
    for line in lines[:10]:
        # Clean up line  
        line = re.sub(r"^[-•*▪►◆→|]\s*", "", line).strip()
        if line and len(line) > 3 and len(line) < 200:
            projects.append(line)

    return projects[:10]


def _extract_certifications(text: str) -> list:
    """Extract certifications."""
    cert_section = _extract_section(
        text, ["certifications", "certification", "certificates", "licenses", "credentials"]
    )
    if not cert_section:
        # Also look for common certification keywords
        cert_patterns = [
            r"(?:AWS|Azure|GCP|Google|Cisco|Oracle|Microsoft|CompTIA)\s*[\w\s-]+(?:cert\w*|practitioner|associate|professional|expert|specialist)",
            r"(?:PMP|CISSP|CCNA|CCNP|CKA|CKAD|CKS)\b",
        ]
        found = []
        for pattern in cert_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            found.extend(matches)
        return [m.strip() for m in found[:10]]

    lines = [l.strip() for l in cert_section.split("\n") if l.strip()]
    certs = []
    for line in lines[:10]:
        line = re.sub(r"^[-•*▪►◆→|]\s*", "", line).strip()
        if line and len(line) > 3 and len(line) < 200:
            certs.append(line)

    return certs[:10]


def _extract_section(text: str, section_headers: list) -> str:
    """Extract text content under a given section header."""
    text_lines = text.split("\n")
    capturing = False
    content = []

    # Common section headers that indicate end of current section
    all_headers = {
        "education", "experience", "skills", "projects", "certifications",
        "work experience", "professional experience", "technical skills",
        "personal projects", "academic projects", "achievements", "awards",
        "publications", "references", "interests", "hobbies", "summary",
        "objective", "profile", "about", "contact", "languages",
        "qualifications", "training", "courses", "volunteer",
    }

    for line in text_lines:
        stripped = line.strip().lower().rstrip(":")
        stripped = re.sub(r"^[#=\-_*]+\s*", "", stripped).strip()

        if any(h == stripped for h in section_headers):
            capturing = True
            continue

        if capturing:
            # Check if we hit another section header
            if stripped in all_headers and stripped not in section_headers:
                break
            content.append(line)

    return "\n".join(content).strip() if content else None
