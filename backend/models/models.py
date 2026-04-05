import json
from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from backend.core.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    skills = Column(Text, default="[]")  # JSON list
    education = Column(Text, nullable=True)
    experience_years = Column(Float, default=0)
    projects = Column(Text, default="[]")  # JSON list
    certifications = Column(Text, default="[]")  # JSON list
    file_path = Column(String(500), nullable=True)
    file_name = Column(String(255), nullable=True)
    raw_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    screening_results = relationship("ScreeningResult", back_populates="resume")

    @property
    def skills_list(self):
        return json.loads(self.skills) if self.skills else []

    @skills_list.setter
    def skills_list(self, value):
        self.skills = json.dumps(value)

    @property
    def projects_list(self):
        return json.loads(self.projects) if self.projects else []

    @projects_list.setter
    def projects_list(self, value):
        self.projects = json.dumps(value)

    @property
    def certifications_list(self):
        return json.loads(self.certifications) if self.certifications else []

    @certifications_list.setter
    def certifications_list(self, value):
        self.certifications = json.dumps(value)


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    skills_required = Column(Text, default="[]")  # JSON list
    skills_preferred = Column(Text, default="[]")  # JSON list
    experience_required = Column(Float, default=0)
    education_required = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    screening_results = relationship("ScreeningResult", back_populates="job")

    @property
    def skills_required_list(self):
        return json.loads(self.skills_required) if self.skills_required else []

    @skills_required_list.setter
    def skills_required_list(self, value):
        self.skills_required = json.dumps(value)

    @property
    def skills_preferred_list(self):
        return json.loads(self.skills_preferred) if self.skills_preferred else []

    @skills_preferred_list.setter
    def skills_preferred_list(self, value):
        self.skills_preferred = json.dumps(value)


class ScreeningResult(Base):
    __tablename__ = "screening_results"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    match_score = Column(Float, default=0.0)
    prediction = Column(String(50), default="Pending")
    probability = Column(Float, default=0.0)
    explanation = Column(Text, default="{}")  # JSON dict
    feature_scores = Column(Text, default="{}")  # JSON dict
    strengths = Column(Text, default="[]")  # JSON list
    weaknesses = Column(Text, default="[]")  # JSON list
    matched_skills = Column(Text, default="[]")  # JSON list
    missing_skills = Column(Text, default="[]")  # JSON list
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="screening_results")
    job = relationship("JobDescription", back_populates="screening_results")
