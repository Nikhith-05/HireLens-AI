import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Database
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'database' / 'hirelens.db'}")

# Upload directory
UPLOAD_DIR = BASE_DIR / "data" / "resumes"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

# Max file size (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024

# CORS origins
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# Matching weights
MATCHING_WEIGHTS = {
    "skill_score": 0.40,
    "experience_score": 0.25,
    "project_score": 0.20,
    "education_score": 0.15,
}

# Selection threshold
SELECTION_THRESHOLD = 0.60
