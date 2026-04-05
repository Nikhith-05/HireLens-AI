# SOFTWARE REQUIREMENTS SPECIFICATION
## HireLens AI — Explainable AI Resume Screening System

**Document Version:** 1.0
**Academic Year:** 2025–2026
**Document Type:** Software Requirements Specification (SRS)

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
   - 1.1 [Document Purpose](#11-document-purpose)
   - 1.2 [Project Scope](#12-project-scope)
   - 1.3 [Existing Systems](#13-existing-systems)
   - 1.4 [Problems with Existing Systems](#14-problems-with-existing-systems)
   - 1.5 [Proposed System](#15-proposed-system)
   - 1.6 [Advantages of Proposed System](#16-advantages-of-proposed-system)
2. [Overall Description](#2-overall-description)
   - 2.1 [Feasibility Study](#21-feasibility-study)
   - 2.2 [Product Functionality](#22-product-functionality)
   - 2.3 [Design and Implementation Constraints](#23-design-and-implementation-constraints)
   - 2.4 [Assumptions and Dependencies](#24-assumptions-and-dependencies)
   - [Conclusion](#conclusion)
3. [Functional Requirements](#3-functional-requirements)
   - 3.1 [Software Requirement Specifications](#31-software-requirement-specifications)
   - 3.2 [Hardware Requirements Specifications](#32-hardware-requirements-specifications)
   - 3.3 [UML Diagrams](#33-uml-diagrams)
4. [Other Non-Functional Requirements](#4-other-non-functional-requirements)
   - 4.1 [Performance Requirements](#41-performance-requirements)
   - 4.2 [Safety and Security Requirements](#42-safety-and-security-requirements)
   - 4.3 [Software Quality Attributes](#43-software-quality-attributes)
5. [Other Requirements](#5-other-requirements)
   - 5.1 [Database Requirements](#51-database-requirements)
   - 5.2 [Internationalization Requirements](#52-internationalization-requirements)
   - 5.3 [Legal Requirements](#53-legal-requirements)
   - 5.4 [Reuse Objectives](#54-reuse-objectives)
   - 5.5 [Development Environment Requirements](#55-development-environment-requirements)
   - 5.6 [Documentation Requirements](#56-documentation-requirements)
6. [References](#6-references)

---

## 1. INTRODUCTION

HireLens AI is a web-based, full-stack software system designed to automate and explain the resume screening process for recruiters and hiring managers. The system accepts candidate resumes in PDF, DOCX, and TXT formats alongside free-form job description text, processes both through a modular Explainable Artificial Intelligence (XAI) pipeline, and produces a quantitative match score accompanied by a transparent, human-readable justification for every screening decision. The application is built on a three-tier architecture comprising a React 19 Single-Page Application frontend, a FastAPI Python backend, and a SQLite relational database, all integrated through a RESTful API. By combining automated information extraction, weighted multi-dimensional scoring, and natural language explainability generation, HireLens AI addresses the dual challenge of screening efficiency and decision transparency that pervades modern recruitment.

This specification document formally captures all functional and non-functional requirements of the HireLens AI system as derived from a thorough analysis of the project codebase, including all Python source modules under the [ai/](file:///d:/Projects/HireLens%20AI/ai/resume_parser/parser.py#115-119) and `backend/` directories, all React components and pages under `frontend/src/`, all configuration files, and the declared package dependencies in `requirements.txt` and `package.json`. The document serves as the authoritative reference for the system's capabilities, constraints, interfaces, and quality standards, and is intended for use by developers, evaluators, and academic assessors.

---

### 1.1 DOCUMENT PURPOSE

The purpose of this Software Requirements Specification (SRS) is to provide a complete, unambiguous, and formally structured account of the requirements governing the design, development, testing, and deployment of the HireLens AI system. This document translates the system's intended capabilities — as expressed through its implemented codebase — into precise, verifiable requirement statements that can serve as the basis for system validation, academic evaluation, and future development planning. It defines what the system does, the conditions under which it must operate, the constraints within which it was built, the quality attributes it must exhibit, and the technical environment in which it runs. All requirements specified herein have been derived exclusively from features and behaviours directly observable in the implemented source code and declared dependencies, ensuring that this SRS accurately reflects the as-built system rather than aspirational or hypothetical capabilities.

---

### 1.2 PROJECT SCOPE

- HireLens AI provides an end-to-end automated resume screening workflow accessible through a web browser, covering the complete pipeline from resume file upload to explainable match result delivery.
- The system parses candidate resume files in three formats — Portable Document Format (PDF), Microsoft Word Open XML (DOCX), and plain text (TXT) — extracting structured fields including candidate name, email address, phone number, technical skills (up to 30), education level, years of experience, project descriptions, and professional certifications.
- The system accepts free-form job description text submitted via a web form and automatically extracts structured requirements including required technical skills, preferred technical skills, minimum years of experience, and required education level.
- A configurable weighted AI scoring pipeline evaluates each resume against a job description across four primary dimensions — skill coverage (40%), work experience (25%), project relevance (20%), and educational attainment (15%) — plus a supplementary certification adjustment of up to 5%.
- A binary prediction ("Selected" or "Rejected") is generated by applying a configurable decision threshold (default: 60%) to the final weighted match score.
- A dedicated explainability engine generates, for every screening decision, a complete breakdown comprising: per-feature contribution scores and labels, a natural language summary, a list of matched skills, a list of missing skills, and structured lists of candidate strengths and weaknesses.
- The system supports batch processing, enabling all uploaded resumes to be matched against a single job description in a single operation with results returned in descending rank order.
- A side-by-side candidate comparison feature evaluates any two candidates against the same job and produces structured pros, cons, and an automatically generated hiring recommendation.
- All uploaded resumes, submitted job descriptions, and generated screening results are persisted in a relational database (SQLite via SQLAlchemy), support retrieval across sessions, and can be deleted individually with cascading cleanup.
- The system exposes a RESTful API backend (FastAPI) serving 12 endpoints under the `/api` prefix, consumed by the React frontend via Axios HTTP calls.
- The scope explicitly excludes: email or calendar integration, interview scheduling, candidate communication features, multi-user authentication, and real-time collaborative features.

---

### 1.3 EXISTING SYSTEMS

- **Commercial Applicant Tracking Systems (ATS) — Workday, Greenhouse, Lever, SAP SuccessFactors:** Enterprise-grade platforms that integrate resume ingestion, keyword filtering, candidate pipeline management, and recruiter collaboration into comprehensive HR suites. These systems operate at large scale but are licensed to enterprise organisations at significant cost.
- **ATS Resume Parsing Vendors — Sovren (Textkernel), RChilli:** Third-party parsing APIs embedded within commercial ATS platforms to extract structured fields from resumes. While technically capable, their parsing logic is proprietary and opaque.
- **Keyword-Based Filtering Engines:** The dominant screening approach in commercial systems, these engines match resume text against a list of job description keywords and filter candidates whose resumes do not contain a sufficient number of matching terms.
- **TF-IDF Based Resume Rankers:** Academic and semi-commercial tools that apply Term Frequency–Inverse Document Frequency weighting to compute a relevance score between a resume document and a job description document, ranking candidates in descending order of computed relevance.
- **LinkedIn Recruiter with AI Match:** LinkedIn's recruitment product uses machine learning models trained on professional profile data to suggest candidate matches. However, the model logic is entirely proprietary and no explanation is provided for candidate rankings.
- **Open-Source ATS — OpenCATS, Recruiterbox:** Free, self-hosted pipeline management tools for small organisations. These systems offer job posting, candidate tracking, and notes functionality but contain no AI-driven scoring, NLP-based parsing, or explainability features.
- **Research Prototypes — Job–Resume Matching with Sentence BERT:** Academic implementations using sentence transformer embeddings and cosine similarity to compute semantic résumé–job matches, typically demonstrated as Jupyter notebooks without a deployable web interface or persistent storage.

---

### 1.4 PROBLEMS WITH EXISTING SYSTEMS

- **Decision Opacity:** Commercial ATS platforms and AI-based rankers produce ranking scores without any explanation of which candidate attributes contributed to the score or why. Recruiters cannot audit, understand, or justify automated screening decisions, violating the principles of fair and accountable hiring.
- **Regulatory Non-Compliance Risk:** Automated hiring decisions made without explanation are potentially non-compliant with the EU General Data Protection Regulation (GDPR) Article 22, which grants data subjects the right to an explanation for automated decisions that significantly affect them. Existing black-box systems do not natively satisfy this requirement.
- **Pure Keyword Fragility:** Keyword-based filtering produces high false-negative rates for candidates who use synonymous or alternative terminology (e.g., "ML" vs. "machine learning", "React.js" vs. "ReactJS"). Qualified candidates are routinely eliminated because their vocabulary does not precisely match the job description's phrasing.
- **Absence of Multi-Dimensional Scoring:** Most existing tools produce a single relevance score based on keyword density or embedding similarity, without decomposing candidate fit into independently weighted dimensions such as skill coverage, experience depth, educational attainment, and project relevance. This prevents recruiters from understanding which specific dimension drove the ranking.
- **High Cost and Accessibility Barriers:** Enterprise ATS platforms are priced for large organisations and are inaccessible to academic institutions, small businesses, individual recruiters, and student developers seeking to build or study AI hiring tools.
- **No Candidate Comparison Functionality:** Existing tools rank candidates individually but do not provide a structured, data-driven side-by-side comparison of two specific candidates for the same role with diagnostic pros, cons, and a hiring recommendation.
- **Non-Deployable Research Tools:** Academic prototypes demonstrate sophisticated NLP techniques but are delivered as undeployable scripts or notebooks without persistent storage, REST APIs, or user interfaces, making them impractical for real-world evaluation.
- **Lack of Batch Processing with Unified Ranking:** Few open-source tools support processing an entire pool of uploaded resumes against a single job description in a single operation and returning a unified ranked leaderboard with aggregate statistics.

---

### 1.5 PROPOSED SYSTEM

- HireLens AI proposes a transparent, explainable, and fully deployable AI resume screening system that processes multi-format resumes through a modular six-stage pipeline: (1) document text extraction, (2) structured field parsing, (3) job description analysis, (4) multi-dimensional feature scoring, (5) weighted score aggregation with selection prediction, and (6) explainability report generation.
- The system replaces opaque scoring with a **Weighted Linear Combination (WLC)** model in which every dimension's score is independently computed, individually named, and its contribution to the final score is explicitly communicated to the recruiter.
- A curated technical skill ontology (`KNOWN_SKILLS`) containing over 150 terms across programming languages, frameworks, AI/ML libraries, databases, cloud platforms, and DevOps tools enables deterministic, auditable skill extraction from both resumes and job descriptions using regex-pattern matching with multi-word-first ordering.
- The explainability module generates per-feature contribution labels, qualitative score descriptors (Excellent / Good / Moderate / Low / Very Low), a natural language summary sentence block, and structured strengths and weaknesses lists — making the reasoning behind every screening decision accessible to non-technical recruiters.
- The candidate comparison module independently runs the full matching pipeline for two candidates and delivers a structured side-by-side output including per-candidate feature scores, pros, cons, matched and missing skills, match score, prediction, and an automatically generated natural language recommendation identifying the stronger candidate.
- Batch processing enables a recruiter to match all resumes in the database against a selected job in a single API call, with results persisted and rendered in ranked order with aggregate statistics (total candidates, selected count, rejected count, average score).
- All data is persisted in a SQLite relational database via SQLAlchemy ORM, with three normalised tables (`resumes`, `job_descriptions`, `screening_results`) supporting full CRUD and cascading delete operations.
- The system is delivered as a fully integrated web application — React 19 SPA frontend (Vite, TailwindCSS) communicating with a FastAPI + Uvicorn backend — deployable locally without cloud dependencies.

---

### 1.6 ADVANTAGES OF PROPOSED SYSTEM

- **Full Decision Transparency:** Every screening result is accompanied by a complete, human-readable explanation including feature contribution breakdowns, matched skills, missing skills, qualitative descriptors, and a natural language summary — making HireLens AI fully auditable at the individual decision level.
- **Multi-Dimensional Candidate Evaluation:** Rather than ranking by a single relevance score, the system independently evaluates candidates across five dimensions (skills, experience, education, projects, certifications), providing actionable diagnostic information that enables targeted feedback and fair comparison.
- **Configurable Scoring Behaviour:** All matching weights and the selection threshold are centralised in `backend/core/config.py` and can be adjusted without code changes, enabling the system to be tuned for different role types (e.g., increasing experience weight for senior roles, skills weight for junior technical roles).
- **Multi-Format Resume Support:** The system natively handles PDF (via pdfplumber), DOCX (via python-docx), and TXT files — the three most common resume formats — in a single unified pipeline without requiring pre-conversion or user reformatting.
- **Structured Candidate Comparison:** The side-by-side comparison feature provides structured pros, cons, and a data-driven recommendation for selecting between two finalists, a capability absent from virtually all open-source alternatives.
- **Batch Processing and Ranked Leaderboard:** All uploaded resumes can be evaluated against any job in a single operation, with results returned as a ranked leaderboard accompanied by aggregate statistics, dramatically reducing the manual effort of initial candidate shortlisting.
- **Zero-Cost, Open Architecture:** The system is built entirely on open-source libraries and frameworks (FastAPI, React, SQLite, pdfplumber, spaCy, sentence-transformers), requires no external API subscriptions or cloud services for core operation, and is fully self-hosted.
- **GDPR-Aligned by Design:** By generating human-readable explanations for every automated screening decision, the system is architecturally aligned with GDPR Article 22's explainability principle, supporting organisations seeking compliant AI-assisted hiring workflows.
- **Persistent Multi-Session Data:** Screening results, resumes, and job descriptions are stored in a relational database and remain accessible across browser sessions, enabling longitudinal candidate pool management without repeated re-processing.
- **Modular and Extensible AI Pipeline:** Each AI module (`resume_parser`, `job_parser`, `feature_extractor`, `matching_engine`, `explainability`, `comparison`) is an independent Python package with a clearly defined function interface, enabling individual components to be upgraded (e.g., replacing regex skill extraction with spaCy NER) without affecting the rest of the pipeline.

---

## 2. OVERALL DESCRIPTION

HireLens AI is a complete, three-tier web application system with a clearly separated presentation layer (React SPA), application-logic layer (FastAPI + AI pipeline), and data layer (SQLite database + filesystem). From the user's perspective, the system presents as a multi-page web application accessed through a standard browser, guiding recruiters through a structured workflow: uploading a candidate's resume, submitting the target job description, receiving a full AI-generated screening report, and optionally performing batch ranking or head-to-head candidate comparisons. From the system's perspective, each recruiter action triggers one or more REST API calls that invoke the appropriate stage of the AI pipeline, persist results, and return structured JSON responses for frontend rendering.

The system is designed as a standalone, self-contained application that can be run entirely on a local development machine without cloud dependencies. Its modular architecture ensures that each AI sub-module — parsing, feature extraction, matching, explainability, and comparison — functions as an independent, testable unit. The backend configuration is centralised and environment-variable-aware, supporting future deployment to production infrastructure with minimal modification. The frontend is a code-split React application served by Vite, communicating with the backend exclusively through a well-defined REST API boundary that isolates UI concerns from AI logic entirely.

---

### 2.1 FEASIBILITY STUDY

**Technical Feasibility:**
- The system operates on a Python 3.10+ backend using well-established, stable open-source libraries (FastAPI, SQLAlchemy, pdfplumber, python-docx) that have demonstrated production readiness across thousands of real-world deployments.
- The AI pipeline does not require GPU hardware or cloud-based model inference; all feature scoring is performed through deterministic mathematical operations (set intersection, ratio computation, weighted summation) on a standard CPU, making the system feasible on commodity hardware.
- The `sentence-transformers`, `spaCy`, `shap`, `lime`, and `keybert` libraries are included as dependencies and represent the technical foundation for future advanced NLP features; their inclusion confirms technical feasibility for enhancement paths without requiring architectural changes.
- The React 19 + Vite frontend stack is mature, widely supported, and runs in all modern browsers without plugins or special client configuration.
- SQLite provides a zero-configuration, file-based relational database fully integrated with Python's standard library, eliminating database server setup as a deployment complexity.

**Economic Feasibility:**
- The entire software stack — Python, FastAPI, React, SQLite, pdfplumber, spaCy, and all other dependencies — is available under open-source licences (MIT, Apache 2.0, BSD) at zero licensing cost.
- Development requires only a standard development machine meeting the hardware specifications listed in Section 3.2; no cloud compute, GPU infrastructure, or proprietary software is required.
- The absence of third-party API subscriptions (no OpenAI, no paid NLP services, no ATS licensing) eliminates recurring operational costs for academic or small-scale deployment.

**Operational Feasibility:**
- The web interface is designed to require no user training; the upload-page three-step guided workflow (Step 1: Resume Upload → Step 2: Job Description → Step 3: Results) communicates the process through visual step indicators and progress states.
- Recruiters with no AI or data science background can operate the system fully, as all AI outputs are translated into natural language explanations, skill tag visualisations, and colour-coded score gauges by the frontend.
- System administration (adding jobs, clearing resumes, viewing rankings) requires only browser navigation, without command-line access.

**Schedule Feasibility:**
- The modular pipeline architecture — where each AI module is independently implementable and testable — enabled parallel development of parsing, feature extraction, and explainability components, reducing overall development timeline.
- The use of FastAPI's automatic Pydantic validation and React's component-based composition reduced boilerplate and accelerated both backend and frontend development cycles.

---

### 2.2 PRODUCT FUNCTIONALITY

- **Resume Upload and Parsing:** Accepts PDF, DOCX, and TXT resume files (≤ 10 MB) via a drag-and-drop or file-browser interface. Extracts: candidate name (first non-header line heuristic), email address (regex), phone number (regex with multiple format patterns), technical skills (ontology matching against 150+ curated skills, capped at 30), education level (degree pattern regex), years of experience (explicit phrase regex + role date-range counting), project descriptions (section-based extraction), and certifications (section-based and keyword-pattern extraction). Stores parsed data in the `resumes` database table with the uploaded file saved to `data/resumes/` under a UUID-based filename.
- **Job Description Submission and Parsing:** Accepts a job title and free-form description text via a web form. Automatically extracts: required skills (all detected technical terms), preferred skills (terms in "preferred / nice-to-have" contextual regions), minimum experience requirement (regex on years patterns), and required education level (education level hierarchy matching). Stores parsed data in the `job_descriptions` database table.
- **Single Resume–Job Matching:** Invokes the full AI pipeline for a specified resume–job pair. Returns match score (0–100%), binary prediction (Selected / Rejected), per-feature scores (skill, experience, education, project, certification, semantic), natural language explanation with feature contributions, matched skills list, missing skills list, strengths list, and weaknesses list. Persists the result in the `screening_results` table.
- **Batch Matching:** Processes all uploaded resumes against a specified job description in a single API call via `POST /api/match_batch`. Returns a list of individual `ScreeningResultResponse` objects — one per resume — with full scoring and explanation data.
- **Ranked Candidate Leaderboard:** Retrieves all screening results for a specified job, ordered by match score descending, via `GET /api/results/{job_id}`. Frontend renders a ranked list with numeric rank positions, candidate names, predictions, and match scores, accompanied by aggregate statistics (total, selected count, rejected count, average score).
- **Detailed Result View:** Retrieves the full screening result for a specific resume–job pair via `GET /api/results/{job_id}/detail/{resume_id}`. Frontend renders a `ScoreGauge`, `FeatureBars`, `SkillTags` (matched and missing), and `ExplanationPanel` for the selected candidate.
- **Candidate Comparison:** Evaluates two specified resumes against the same job via `POST /api/compare_resumes`. Each candidate's result includes match score, prediction, skills coverage, experience relevance, project relevance, education match, pros, cons, matched skills, and missing skills. A natural language recommendation identifies the stronger candidate or notes a close match if scores differ by fewer than 5 percentage points.
- **Resume and Job Management:** Supports listing all uploaded resumes (`GET /api/resumes`) and all job descriptions (`GET /api/jobs`) with pagination by recency. Supports deletion of individual resumes (`DELETE /api/resumes/{id}`) and job descriptions (`DELETE /api/jobs/{id}`) with cascading deletion of associated screening results. Uploaded files are also removed from the filesystem on resume deletion.
- **Static File Serving:** Uploaded resume files are served as static assets via the FastAPI `/uploads/` static mount, enabling browser retrieval or display of the original uploaded documents.
- **Application Health Check:** Exposes `GET /api/health` returning `{"status": "healthy", "service": "HireLens AI"}` for monitoring and deployment verification purposes.

---

### 2.3 DESIGN AND IMPLEMENTATION CONSTRAINTS

- **Programming Language Constraint:** The backend AI pipeline and REST API are implemented exclusively in Python 3.10 or higher, as required by the type annotation syntax and library compatibility requirements of FastAPI (0.115.0), SQLAlchemy (2.0.35), and the AI libraries listed in `requirements.txt`.
- **Frontend Framework Constraint:** The frontend is implemented in React 19 using JSX syntax, compiled and bundled by Vite 8.0.0. The use of React Router DOM 7.x enforces a client-side single-page application routing model; server-side rendering (SSR) is not implemented.
- **Database Constraint:** The system uses SQLite as its relational database, accessed via SQLAlchemy 2.0.35. SQLite's file-based, single-writer architecture imposes a concurrency constraint: simultaneous write operations from multiple processes are not supported. The `check_same_thread=False` connection argument is explicitly configured to allow multi-threaded access within the single Uvicorn worker process.
- **File Format Constraint:** Resume uploads are restricted to `.pdf`, `.docx`, and `.txt` file extensions, enforced by the `ALLOWED_EXTENSIONS` configuration set and validated at the API route layer before parsing commences. Files of other types (images, spreadsheets, presentations) are rejected with HTTP 400 responses.
- **File Size Constraint:** Resume file uploads are limited to 10 MB (`MAX_FILE_SIZE = 10 * 1024 * 1024` bytes), enforced after reading the file content into memory but before saving to disk or invoking the parser.
- **Skill Ontology Boundary:** Skill extraction relies on a statically defined set (`KNOWN_SKILLS`) of approximately 150 technical terms. Skills not present in this ontology are not extracted from resumes or job descriptions. This is a deliberate design constraint that prioritises determinism and auditability over recall completeness.
- **CORS Constraint:** The backend allows cross-origin requests only from `http://localhost:5173` and `http://localhost:3000` (the default Vite and Create React App development ports). Cross-origin requests from any other origin are rejected by the CORS middleware. This constraint must be updated before internet-accessible deployment.
- **Synchronous AI Processing Constraint:** All AI pipeline stages (parsing, feature extraction, matching, explainability) execute synchronously within FastAPI route handler functions. Long-running operations (e.g., processing a large PDF or a large batch) block the ASGI event loop for the duration of processing, which constrains throughput to serial request execution per worker.
- **No Authentication Constraint:** The system implements no user authentication, authorisation, or session management. All API endpoints are publicly accessible to any client that can reach the backend. This is appropriate for a local development deployment but is an explicit constraint for production use.
- **Storage Co-location Constraint:** Uploaded resume files and the SQLite database file are stored on the same local filesystem as the running application. This constrains horizontal scaling to a single server instance; distributed or cloud-native deployment would require migration to cloud object storage and a managed database service.
- **Matching Weight Configurability:** The four primary matching weights and the selection threshold are centralised in `backend/core/config.py`. The weights must sum to 1.0 for the scoring formula to produce valid percentage results; this invariant is a design constraint that must be maintained if weights are modified.

---

### 2.4 ASSUMPTIONS AND DEPENDENCIES

- **Assumption — Resume Structure:** It is assumed that submitted resume files are formatted with conventional section organisation (Skills, Education, Experience, Projects, Certifications) such that the section-detection heuristics in the resume parser can reliably identify and extract section-specific content. Unconventionally formatted or graphically complex resumes (e.g., multi-column PDF layouts with embedded tables, image-based text) may result in incomplete field extraction.
- **Assumption — Job Description Language:** It is assumed that job descriptions are written in English and follow conventional recruitment phrasing (e.g., "required", "preferred", "must have", "minimum X years of experience") such that the job parser's regex and context-matching patterns can reliably extract requirements. Non-English or highly informal job descriptions may produce incomplete parsing results.
- **Assumption — Skill Name Normalisation:** It is assumed that most technical skill names used in submitted resumes and job descriptions correspond to the normalised forms present in the KNOWN_SKILLS ontology (e.g., "reactjs" and "react.js" both appear in the ontology). Custom, proprietary, or highly domain-specific skill names not in the ontology will not be extracted.
- **Assumption — Single-User Deployment:** The system is assumed to be deployed for use by a single recruiter or a small team operating sequentially (not concurrently) due to the SQLite single-writer constraint. Concurrent multi-user write operations are not supported in the current deployment configuration.
- **Dependency — Python 3.10+:** All backend modules depend on Python 3.10 or higher. Lower Python versions are incompatible with the type annotation syntax and library versions used.
- **Dependency — Node.js 18+ and npm:** The React frontend and its build tool (Vite 8.0.0) require Node.js 18 or higher and the npm package manager to install dependencies and run the development server.
- **Dependency — pdfplumber and python-docx:** Text extraction from PDF and DOCX files is entirely dependent on the `pdfplumber` and `python-docx` libraries respectively. Resumes with password protection, DRM, or embedded image-only content (scanned resumes without OCR) cannot be parsed by these libraries and will produce empty extraction results.
- **Dependency — sentence-transformers (Hugging Face):** The `sentence-transformers` library, included in `requirements.txt`, requires downloading pre-trained model weights from the Hugging Face Hub on first use. This requires an active internet connection during initial setup. Subsequent uses operate from the locally cached model weights.
- **Dependency — spaCy Language Model:** The `spaCy` library requires a separately downloaded language model (`en_core_web_sm` or equivalent) installed via `python -m spacy download en_core_web_sm`. The application will fail to import spaCy NLP pipelines if the model has not been downloaded.
- **Dependency — Frontend–Backend Port Convention:** The Vite proxy configuration (if applicable) or CORS configuration assumes the backend runs on `localhost:8000` and the frontend on `localhost:5173`. Changing either port requires a corresponding update to `backend/core/config.py` (CORS origins) and potentially the Vite proxy settings.
- **Dependency — Filesystem Write Permissions:** The application requires write permissions to create and modify files in the `data/resumes/` directory (for file uploads) and the `database/` directory (for the SQLite `.db` file). Absence of write permissions will cause runtime errors during file upload or database initialisation.

---

### CONCLUSION

HireLens AI presents a technically sound, architecturally coherent, and practically deployable solution to the twin challenges of recruitment scale and hiring transparency. The system's feasibility across technical, economic, operational, and schedule dimensions — as analysed in Section 2.1 — confirms its viability as a production-ready prototype for academic demonstration and real-world pilot deployment. The product functionality described in Section 2.2 encompasses the complete recruiter workflow from document ingestion to explainable decision delivery, with every feature grounded in the actual implemented codebase. The constraints documented in Section 2.3 define the boundaries within which the system reliably operates, providing a clear roadmap for the engineering changes required to extend the system to production scale. The assumptions and dependencies in Section 2.4 establish the environmental preconditions that must be satisfied to operate the system correctly. Together, these elements define a system that is complete with respect to its stated scope, honest about its present limitations, and structured for disciplined future extension — embodying the principles of responsible, explainable AI-assisted hiring that motivate its creation.

---

## 3. FUNCTIONAL REQUIREMENTS

- **FR-01 — Resume File Upload:** The system shall accept resume file uploads from a browser client via a multipart/form-data HTTP POST request to `POST /api/upload_resume`. The uploaded file shall be validated for a permitted extension (`.pdf`, `.docx`, `.txt`) and a size not exceeding 10 MB (10,485,760 bytes) before any further processing occurs. Validation failures shall produce HTTP 400 responses with descriptive error messages.
- **FR-02 — PDF Text Extraction:** When the uploaded file has a `.pdf` extension, the system shall extract raw text from all pages of the document using the `pdfplumber` library. Each page's extracted text shall be concatenated with a newline separator to form a single raw text string for downstream parsing.
- **FR-03 — DOCX Text Extraction:** When the uploaded file has a `.docx` extension, the system shall extract raw text by reading all paragraph objects from the document using the `python-docx` library, filtering out empty paragraphs, and joining the remaining paragraphs with newline separators.
- **FR-04 — TXT Text Extraction:** When the uploaded file has a `.txt` extension, the system shall read the file contents using UTF-8 encoding with an `errors='ignore'` fallback, returning the complete file text as the raw extraction result.
- **FR-05 — Candidate Name Extraction:** The system shall extract the candidate's name from the resume raw text by identifying the first non-empty line that does not contain an email address, phone number, URL, or common section header keyword (e.g., "resume", "curriculum vitae", "profile"). The extracted name shall be stored in the `name` column of the `resumes` table, defaulting to "Unknown" if no suitable line is found.
- **FR-06 — Email Address Extraction:** The system shall extract the candidate's email address from the resume raw text using a compiled regular expression matching the RFC 5322 simplified pattern `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`. The first match found shall be stored in the `email` column of the `resumes` table.
- **FR-07 — Phone Number Extraction:** The system shall extract the candidate's phone number using a regular expression pattern supporting common international and domestic formats including country code prefixes (`+91`, `+1`, etc.), brackets, spaces, and hyphens as delimiters. The first match shall be stored in the `phone` column.
- **FR-08 — Technical Skill Extraction:** The system shall extract technical skills from the resume raw text by matching against the `KNOWN_SKILLS` ontology. The ontology shall be iterated in descending order of term character length to ensure that multi-word skills (e.g., "machine learning", "spring boot") are matched before their component single words. For single-character or short terms, word-boundary regex anchors (`\b`) shall be applied to prevent false positive matches. The result shall be a deduplicated list of properly cased skill names, capped at 30 entries, stored as a JSON-serialised string in the `skills` column.
- **FR-09 — Education Level Extraction:** The system shall extract the candidate's highest education level by matching the resume raw text against a defined education hierarchy in descending priority order: PhD/Doctorate, Master's degree (M.S., M.E., M.Tech, MBA), Bachelor's degree (B.E., B.Tech, B.Sc, B.A., B.Com), and Diploma. The highest matched level shall be stored in the `education` column.
- **FR-10 — Experience Years Extraction:** The system shall extract the candidate's total years of professional experience through two strategies: (1) direct regex matching of phrases such as "X years of experience", "X+ years", and "X yrs"; and (2) summing the durations of individual date-range entries (e.g., "Mar 2020 – Dec 2022") found in the experience section. The larger of the two computed values shall be stored in the `experience_years` column.
- **FR-11 — Project Extraction:** The system shall identify and extract project names and descriptions from the resume by detecting section boundaries labelled with keywords such as "projects", "academic projects", "personal projects", or "work samples". Extracted content shall be stored as a JSON-serialised list in the `projects` column.
- **FR-12 — Certification Extraction:** The system shall identify and extract certifications by detecting sections labelled with keywords such as "certifications", "certificates", "licences", or "credentials", and by matching lines containing known certification keywords (e.g., "certified", "AWS", "Google", "Microsoft"). Results shall be stored as a JSON-serialised list in the `certifications` column.
- **FR-13 — Job Description Submission:** The system shall accept a job title and free-form job description text via an HTTP POST request (`POST /api/upload_job`) with a JSON body conforming to the `JobDescriptionCreate` Pydantic schema. Both the raw description text and the parsed structured requirements shall be persisted in the `job_descriptions` table.
- **FR-14 — Job Description Parsing:** The system shall parse the submitted job description text to extract: (a) required skills — all technical terms from the KNOWN_SKILLS ontology present in the description; (b) preferred skills — technical terms identified in the context of "preferred", "nice-to-have", "bonus", or "plus" phrases; (c) minimum experience years — numeric values adjacent to "year" or "yr" patterns; (d) required education level — the highest education keyword matched in the description text.
- **FR-15 — Single Resume–Job Matching:** The system shall compute a match result for a specified resume–job pair when a `POST /api/match_resume` request is received. The operation shall invoke `extract_features()`, apply the weighted formula, generate the explainability report, compute strengths and weaknesses, and persist a `ScreeningResult` record. The result shall be returned as a `ScreeningResultResponse` JSON object.
- **FR-16 — Skill Score Computation:** The system shall compute a skill coverage score as the ratio of the intersection of the candidate's normalised skill set and the union of the job's required and preferred skill sets, divided by the total number of unique job skills. If the job defines no skills, the score shall default to 0.5.
- **FR-17 — Experience Score Computation:** The system shall compute an experience score as `min(resume_experience_years / required_experience_years, 1.0)`. If no experience requirement is specified, the score shall be computed as `min(resume_experience_years / 3.0, 1.0)`. If the resume lists zero experience, the raw score shall be 0.0.
- **FR-18 — Education Score Computation:** The system shall map education levels to ordinal integers (Diploma=1, Bachelor's=2, Master's=3, PhD=4) and compute the education score according to the following rules: if the candidate's level meets or exceeds the requirement, the score is 1.0; if one level below, 0.6; if two or more levels below, 0.3. Default scores of 0.7 (requirement is "any") or 0.5 (no education detected) shall be applied where appropriate.
- **FR-19 — Project Relevance Score Computation:** The system shall compute a project relevance score by counting the number of unique job skill keywords found within the concatenated project description text, divided by `max(total_job_skills × 0.3, 1)`, capped at 1.0.
- **FR-20 — Certification Score Computation:** The system shall compute a certification score by counting the number of unique job skill keywords found within the concatenated certification text, normalised by the total number of unique job skills, with a base score of 0.3 added, capped at 1.0. If no job skills are defined, the score shall default to 0.5.
- **FR-21 — Weighted Score Aggregation:** The system shall compute the final match score using the formula: `final_score = min((0.40 × skill_score) + (0.25 × experience_score) + (0.20 × project_score) + (0.15 × education_score) + (certification_score × 0.05), 1.0)`. The match percentage shall be `round(final_score × 100, 1)`.
- **FR-22 — Selection Prediction:** The system shall classify a candidate as "Selected" if `final_score >= SELECTION_THRESHOLD` (default 0.60) and as "Rejected" otherwise. Both the prediction string and a confidence probability derived from the match score shall be included in the result.
- **FR-23 — Explainability Report Generation:** For each screening result, the system shall generate a structured explanation containing: (a) per-feature weighted contributions (score × weight) with impact labels ("positive" / "negative"); (b) qualitative descriptors for each feature score ("Excellent" ≥0.8, "Good" ≥0.6, "Moderate" ≥0.4, "Low" ≥0.2, "Very Low" <0.2); (c) a natural language summary paragraph; (d) matched_skills list; (e) missing_skills list; (f) strengths list; (g) weaknesses list.
- **FR-24 — Batch Matching:** The system shall, upon receiving `POST /api/match_batch` with a `job_id`, retrieve all resumes from the database, invoke the single-match pipeline for each resume–job pair, persist each `ScreeningResult`, and return all results in a list.
- **FR-25 — Ranked Results Retrieval:** The system shall return all screening results for a specified job ordered by `match_score` descending via `GET /api/results/{job_id}`.
- **FR-26 — Detailed Result Retrieval:** The system shall return the complete `ScreeningResult` record, including the full explanation JSON, for a specific resume–job pair via `GET /api/results/{job_id}/detail/{resume_id}`.
- **FR-27 — Candidate Comparison:** The system shall accept two resume IDs and one job ID via `POST /api/compare_resumes`, run the full matching pipeline for each candidate independently, generate per-candidate pros and cons by evaluating feature scores against qualitative thresholds, and produce a natural language recommendation statement identifying the stronger candidate.
- **FR-28 — Entity Listing and Deletion:** The system shall support `GET /api/resumes`, `GET /api/jobs`, `DELETE /api/resumes/{id}`, and `DELETE /api/jobs/{id}` operations. Deletion of a resume shall remove the database record, all associated `ScreeningResult` records, and the uploaded file from the filesystem. Deletion of a job description shall remove the job record and all associated screening results.
- **FR-29 — Health Check Endpoint:** The system shall expose `GET /api/health` returning HTTP 200 with the JSON body `{"status": "healthy", "service": "HireLens AI"}`.
- **FR-30 — Static Asset Serving:** The system shall mount the `data/resumes/` directory as a static file server on the `/uploads/` URL path, allowing uploaded resume files to be retrieved directly from the browser.

---

### 3.1 SOFTWARE REQUIREMENT SPECIFICATIONS

**Backend Runtime and Frameworks:**
- Python 3.10 or higher — Core backend runtime environment
- FastAPI 0.115.0 — Asynchronous web framework for REST API construction; provides automatic request validation via Pydantic and auto-generated OpenAPI/Swagger documentation
- Uvicorn 0.30.0 (with `standard` extras) — ASGI server implementation used to serve the FastAPI application; supports HTTP/1.1 and WebSocket protocols
- SQLAlchemy 2.0.35 — Declarative ORM and SQL toolkit providing database-agnostic model definitions, session lifecycle management, and query construction
- Pydantic (bundled with FastAPI) — Data validation and serialisation library enforcing type safety at all API boundaries
- python-multipart 0.0.9 — Multipart form data parsing library required by FastAPI for handling binary file uploads

**Document Processing Libraries:**
- pdfplumber 0.11.4 — PDF content extraction library; uses pdfminer.six under the hood; extracts text layout from all PDF pages including those with complex multi-column formatting
- python-docx 1.1.2 — Microsoft Word Open XML (DOCX) parsing library; provides access to paragraph, table, and section content

**Natural Language Processing Libraries:**
- spaCy 3.7.6 — Industrial-strength NLP library providing tokenisation, part-of-speech tagging, dependency parsing, and Named Entity Recognition via pre-trained language pipeline models
- sentence-transformers 3.1.0 — Sentence embedding library based on Hugging Face Transformers; generates dense vector representations of text for semantic similarity computation
- scikit-learn 1.5.2 — Machine learning library providing cosine similarity computation and preprocessing utilities
- KeyBERT 0.8.5 — BERT-based keyword extraction library for identifying the most semantically representative terms in a document
- NumPy 1.26.4 — Foundational numerical computing library used by all ML libraries for array operations and mathematical computations

**Explainability Libraries:**
- SHAP 0.46.0 — SHapley Additive exPlanations framework for model-agnostic feature attribution; provides game-theoretically grounded contribution values for individual predictions
- LIME 0.2.0.1 — Local Interpretable Model-agnostic Explanations library for generating per-instance post-hoc explanations of model decisions

**Frontend Runtime and Frameworks:**
- Node.js 18.0.0 or higher — JavaScript runtime environment for frontend build tools and the npm package manager
- npm (bundled with Node.js) — Package manager used for installing and managing frontend dependencies
- React 19.2.4 — Declarative, component-based JavaScript library for building the user interface
- React DOM 19.2.4 — React's rendering engine targeting the web browser Document Object Model
- React Router DOM 7.13.1 — Declarative client-side routing library enabling navigation between application pages without full-page reloads
- Vite 8.0.0 — Modern frontend build tool using native ES module imports and Rollup for production bundling; provides sub-second hot module replacement (HMR) during development
- TailwindCSS 4.2.1 — Utility-first CSS framework providing pre-defined design tokens, responsive layout utilities, and dark mode support
- Axios 1.13.6 — Promise-based HTTP client for browser and Node.js environments; used for all REST API communication from the frontend
- Chart.js 4.5.1 — Canvas-based data visualisation library for rendering interactive charts including gauge and bar chart types
- react-chartjs-2 5.3.1 — React component wrappers for Chart.js enabling declarative chart definition within JSX
- react-dropzone 15.0.0 — React drag-and-drop file input component with MIME type filtering and file validation support
- ESLint 9.39.4 — JavaScript and JSX static analysis tool for enforcing code quality and consistency rules

---

### 3.2 HARDWARE REQUIREMENTS SPECIFICATIONS

**Minimum Hardware Configuration:**
- **Processor:** Intel Core i5 (8th generation or equivalent) or AMD Ryzen 5 3000 series, operating at a minimum clock speed of 1.6 GHz. This is sufficient for sequential request handling with the deterministic AI pipeline (no GPU is required for the current feature extraction implementation).
- **Memory (RAM):** 8 GB minimum. Loading the sentence-transformers model into memory during application startup requires approximately 500 MB–2 GB depending on the model variant; 8 GB ensures adequate headroom for concurrent OS and development tool operation.
- **Storage:** Minimum 5 GB of free disk space, allocated as follows: ~2 GB for the Python virtual environment including all declared AI library dependencies and their transitive dependencies; ~90 MB for sentence-transformer model weights cached by the Hugging Face Hub; ~50 MB for spaCy language model; remaining space for uploaded resume files and the SQLite database file.
- **Operating System:** Windows 10 (64-bit) version 1903 or later; macOS 12.0 (Monterey) or later; Ubuntu 20.04 LTS or any equivalent 64-bit Linux distribution with glibc 2.31 or later.
- **Network Interface:** An active network connection is required during initial dependency installation (`pip install -r requirements.txt`, `npm install`) and during the first launch of the application when sentence-transformer model weights are downloaded from the Hugging Face Hub. Subsequent application runs do not require network connectivity for core functionality.
- **Display:** Minimum display resolution of 1280×720 pixels is required for the React SPA to render correctly; 1920×1080 (Full HD) is recommended for optimal layout display of the comparison and ranking pages.
- **Browser:** Google Chrome 110+ or Microsoft Edge 110+ (Chromium-based) recommended; Mozilla Firefox 110+ is also supported. Internet Explorer is not supported. The browser must have JavaScript enabled.

**Recommended Hardware Configuration:**
- **Processor:** Intel Core i7 (10th generation or later) or AMD Ryzen 7 (5000 series or later), operating at 2.4 GHz or higher, to provide adequate throughput for batch matching operations.
- **Memory (RAM):** 16 GB recommended to comfortably accommodate sentence-transformer model loading alongside development tooling (VS Code, browser with DevTools, terminals).
- **Storage:** SSD with 10 GB free space recommended for significantly faster Python library import times compared to HDD installations.

---

### 3.3 UML DIAGRAMS

*(This section is reserved. UML diagrams — including the Use Case Diagram, Class Diagram, Sequence Diagram, and Activity Diagram — are to be inserted here in the final formatted document.)*

---

## 4. OTHER NON-FUNCTIONAL REQUIREMENTS

Non-functional requirements define the quality attributes and operational standards that the HireLens AI system must maintain independently of any specific functional behaviour. These requirements govern how well the system performs its functions rather than which functions it performs, and they are equally critical to the system's success as the functional requirements themselves. The non-functional requirements of HireLens AI have been defined to reflect the operational context of a web-based AI application serving recruiters in a real-world hiring workflow, where response speed, data integrity, system reliability, and decision transparency are paramount concerns.

---

### 4.1 PERFORMANCE REQUIREMENTS

- **Response Time — Single Match:** The end-to-end latency from receipt of a `POST /api/match_resume` request to delivery of the complete `ScreeningResultResponse` shall not exceed 5 seconds under standard operating conditions on the minimum specified hardware (Core i5, 8 GB RAM), for resume files of typical size (1–3 pages, ≤ 500 KB).
- **Response Time — Resume Upload:** The time from receipt of a `POST /api/upload_resume` request to return of the `ResumeResponse` (including file save, text extraction, and field parsing) shall not exceed 3 seconds for PDF files of up to 3 pages on the minimum hardware configuration. Text-based TXT and DOCX files of equivalent length shall be processed within 1 second.
- **Response Time — Batch Matching:** Batch matching of up to 20 resumes against a single job description via `POST /api/match_batch` shall complete within 60 seconds on the minimum hardware, allowing approximately 3 seconds per resume for the feature extraction and matching computation.
- **Response Time — Frontend Page Load:** The initial load of any application page, including the JavaScript bundle delivery by the Vite development server, shall complete within 3 seconds on a localhost connection. Page-to-page navigation via React Router DOM (client-side routing) shall be instantaneous (< 100 ms) after the initial bundle is loaded.
- **Throughput — Concurrent Requests:** The system is designed for sequential single-user operation. The FastAPI backend running on a single Uvicorn worker processes requests serially due to the synchronous AI pipeline. A maximum of 1 concurrent matching operation is supported without performance degradation. API requests for database reads (listing resumes, jobs, results) shall be handled concurrently with no throughput constraint.
- **Memory Consumption:** The backend application at idle (after model loading) shall consume no more than 2 GB of RAM on the minimum hardware. Peak memory during a single matching operation (when all pipeline modules are active) shall not exceed 3 GB.
- **Storage Growth:** Each uploaded resume file consumes at most 10 MB on disk. Each database record (Resume, JobDescription, ScreeningResult) consumes less than 50 KB of SQLite storage including all JSON columns. The system's storage footprint is therefore bounded by the number of uploaded resumes and their file sizes.

---

### 4.2 SAFETY AND SECURITY REQUIREMENTS

- **File Upload Validation:** All uploaded files shall be validated for permitted extensions (`.pdf`, `.docx`, `.txt`) and maximum size (10 MB) before being written to disk. Extension validation shall be performed by inspecting the file extension from the original filename using `os.path.splitext()`, and size validation shall be performed by reading the file content into memory and checking `len(contents)` against `MAX_FILE_SIZE`. Files failing either validation shall be rejected with HTTP 400 before any write operation occurs.
- **UUID-Based Filename Storage:** Uploaded resume files shall be stored on disk using a UUID4-based filename (`str(uuid.uuid4()) + extension`) rather than the original client-provided filename. This prevents directory traversal attacks, filename collision attacks, and exposure of the internal storage schema to clients.
- **No Execution of Uploaded Content:** The system shall perform only text extraction and regex-based field parsing on uploaded files. Under no circumstances shall uploaded file content be executed, evaluated, or loaded as code. The pdfplumber and python-docx libraries operate as read-only document parsers and do not execute embedded scripts or macros.
- **CORS Access Control:** The backend's CORS middleware shall restrict cross-origin access to explicitly whitelisted origins (`http://localhost:5173`, `http://localhost:3000`). Requests from unlisted origins shall be rejected by the CORS middleware before reaching any route handler. This prevents unauthorised web pages from making cross-origin API calls to the backend.
- **No Sensitive Data Persistence:** The system does not collect or store authentication credentials, session tokens, payment information, or other sensitive personal data beyond the resume content fields provided by the recruiter. The system shall not transmit any stored data to third-party services.
- **Database Integrity:** All database write operations (INSERT, UPDATE, DELETE) shall be performed within SQLAlchemy session transactions that are automatically committed on success and rolled back on exception. This ensures that no partial data state is persisted in the event of a processing error during a pipeline operation.
- **Error Isolation:** Exceptions raised within any AI pipeline module shall be caught at the route handler level. Route handlers shall return appropriate HTTP error codes (400 for invalid input, 404 for missing resources, 500 for unexpected internal errors) with descriptive error detail strings, without exposing internal stack traces or system paths to the client.
- **Static File Access Control:** The `/uploads/` static file mount provides read-only access to files in the `data/resumes/` directory. No write or delete operations are possible through the static mount endpoint. Directory listing is disabled by the StaticFiles mount configuration.
- **No Authentication (Current Scope):** The current implementation provides no authentication or authorisation mechanism. This is an accepted design choice for the academic prototype scope. Any production deployment that handles real candidate data shall implement JWT-based or OAuth 2.0 authentication as a mandatory security enhancement before exposure to a network.

---

### 4.3 SOFTWARE QUALITY ATTRIBUTES

- **Maintainability:** The AI pipeline is decomposed into six independently maintained Python packages (`resume_parser`, `job_parser`, `feature_extractor`, `matching_engine`, `explainability`, `comparison`), each with a clearly defined functional interface. Any individual module can be modified, tested, and replaced without requiring changes to other modules, as all inter-module communication passes through well-typed dictionary structures. Backend configuration is centralised in a single `config.py` file, ensuring that system behaviour changes require modification in only one location.
- **Modularity:** The React frontend follows a strict component hierarchy with clear separation between page components (routing-level, stateful) and UI components (stateless, reusable). Shared UI components (`ScoreGauge`, `FeatureBars`, `ExplanationPanel`, `SkillTags`) are used consistently across multiple pages — `UploadPage`, `ResultsPage`, `ComparePage` — without duplication of rendering logic.
- **Reliability:** The system handles all foreseeable error conditions — invalid file type, oversized file, malformed PDF, missing database record, empty skill extraction — with graceful error returns rather than unhandled exceptions. All database operations are wrapped in try/except blocks at the route handler level, and database session lifecycle is managed by FastAPI's dependency injection system to ensure session cleanup regardless of request outcome.
- **Transparency (Explainability):** As an explicit quality attribute, the system guarantees that no screening decision is presented to the user without an accompanying human-readable explanation. The explainability engine is invoked as a mandatory step within the `match_resume_to_job()` function, and the absence of an explanation field in a screening result is architecturally impossible given the synchronous pipeline execution model.
- **Testability:** Each AI pipeline function accepts plain Python dictionaries as inputs and returns plain Python dictionaries as outputs, with no stateful side effects or I/O operations within the computation functions themselves. This functional interface design makes all six AI modules independently unit-testable with simple in-memory test fixtures, without requiring database connections, file I/O, or HTTP server setup.
- **Portability:** The backend is configurable via the `DATABASE_URL` and `UPLOAD_DIR` settings in `config.py`, enabling the system to be deployed to different environments (development laptop, Linux server, Docker container) without code changes. The frontend is built as a static bundle by Vite that can be served from any HTTP server.
- **Scalability (Architectural):** While the current implementation constrains throughput to a single Uvicorn worker for the synchronous AI pipeline, the modular architecture positions the system for future scalability enhancements: AI pipeline functions can be migrated to async background tasks, and the SQLite database can be replaced with PostgreSQL without changes to the ORM model definitions.
- **Usability:** The frontend's three-step guided upload workflow, colour-coded prediction badges, circular score gauges, horizontal feature-score bars, and skill tag chips collectively make the AI system's outputs interpretable by a recruiter with no data science background. Visual progress indicators and loading states ensure that users receive clear feedback during asynchronous API operations.

---

## 5. OTHER REQUIREMENTS

The requirements in this section extend beyond the core functional and non-functional specifications to address additional technical, legal, organisational, and environmental dimensions of the HireLens AI system. These requirements ensure that the system is deployable in its target operational context, compliant with applicable legal frameworks, and structured for long-term maintainability. Each requirement in this section has been inferred from the codebase, declared dependencies, configuration parameters, or standard engineering practices applicable to web-based AI systems of this type.

---

### 5.1 DATABASE REQUIREMENTS

- **Database Engine:** The production database shall be SQLite, accessed through SQLAlchemy 2.0.35 ORM. The database file shall be located at `database/hirelens.db` relative to the application root, with the path configurable via the `DATABASE_URL` setting in `backend/core/config.py`.
- **Schema Initialisation:** The database schema shall be automatically created on application startup through SQLAlchemy's `Base.metadata.create_all(engine)` call within the FastAPI `lifespan` context manager, ensuring that all required tables exist before the first request is processed.
- **Table — resumes:** Shall contain columns for `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `name` (VARCHAR), `email` (VARCHAR), `phone` (VARCHAR), `skills` (TEXT, JSON-serialised list), `education` (TEXT), `experience_years` (FLOAT), `projects` (TEXT, JSON-serialised list), `certifications` (TEXT, JSON-serialised list), `file_path` (VARCHAR), `file_name` (VARCHAR), `raw_text` (TEXT), `created_at` (DATETIME, default CURRENT_TIMESTAMP).
- **Table — job_descriptions:** Shall contain columns for `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `title` (VARCHAR), `description` (TEXT), `skills_required` (TEXT, JSON-serialised list), `skills_preferred` (TEXT, JSON-serialised list), `experience_required` (FLOAT), `education_required` (VARCHAR), `created_at` (DATETIME, default CURRENT_TIMESTAMP).
- **Table — screening_results:** Shall contain columns for `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `resume_id` (INTEGER, FOREIGN KEY → resumes.id), `job_id` (INTEGER, FOREIGN KEY → job_descriptions.id), `match_score` (FLOAT), `prediction` (VARCHAR), `probability` (FLOAT), `explanation` (TEXT, JSON), `feature_scores` (TEXT, JSON), `strengths` (TEXT, JSON-serialised list), `weaknesses` (TEXT, JSON-serialised list), `matched_skills` (TEXT, JSON-serialised list), `missing_skills` (TEXT, JSON-serialised list), `created_at` (DATETIME, default CURRENT_TIMESTAMP).
- **Referential Integrity:** The `resume_id` and `job_id` foreign keys in `screening_results` shall reference the `id` columns of `resumes` and `job_descriptions` respectively. Cascading delete behaviour for associated `ScreeningResult` records shall be implemented at the application layer within the route handler delete methods, as SQLite's `PRAGMA foreign_keys` enforcement is optional and not relied upon.
- **JSON Column Serialisation:** The `skills`, `projects`, `certifications`, `skills_required`, `skills_preferred`, `strengths`, `weaknesses`, `matched_skills`, `missing_skills`, `feature_scores`, and `explanation` columns shall store data as JSON-serialised strings, with deserialisation performed transparently by Python `@property` accessors on the SQLAlchemy model classes.
- **Concurrency:** The database engine shall be configured with `connect_args={"check_same_thread": False}` to permit access from multiple threads within a single process, appropriate for FastAPI's multi-threaded request dispatching. A single `SessionLocal` factory shall be used across all route handlers, with each request receiving an independently managed session via the `get_db()` dependency injector.
- **Data Retention:** In the current scope, no automatic data retention policy or record purging mechanism is implemented. All records persist indefinitely until explicitly deleted by the recruiter via the delete endpoints.

---

### 5.2 INTERNATIONALIZATION REQUIREMENTS

- **Primary Language:** The HireLens AI system interface, all generated natural language explanations, all error messages, and all API response strings are implemented exclusively in English. No multilingual UI support is provided in the current implementation.
- **Locale Assumption:** The job description parser, resume parser, and all regex extraction patterns are designed for English-language documents following North American and European resume and job posting conventions. The system does not support resume parsing for documents in other languages.
- **Character Encoding:** All file I/O operations shall use UTF-8 encoding with an `errors='ignore'` fallback for resume text reading, ensuring that resumes containing non-ASCII characters (e.g., accented characters in candidate names from non-anglophone regions) are processed without raising encoding exceptions, though non-ASCII characters may be silently excluded from the extracted text.
- **Date Format:** Date range patterns used in experience extraction support the `MMM YYYY` format (e.g., "Mar 2020") and common variants. Other date formats (DD/MM/YYYY, YYYY-MM-DD) for experience range detection are not explicitly supported in the current regex patterns.
- **Currency and Numeric Formatting:** The system does not process or display salary, compensation, or other numeric fields subject to locale-specific formatting conventions. All internal numeric values (scores, percentages) use Python's default IEEE 754 floating-point representation.
- **Future Internationalisation Scope:** The React frontend architecture uses hardcoded English strings in component JSX markup; no internationalisation framework (i18next, react-intl) is integrated. Adding multilingual support would require a dedicated internationalisation sprint involving extraction of all UI strings into a localisation dictionary.

---

### 5.3 LEGAL REQUIREMENTS

- **GDPR Alignment (Article 22 — Automated Decision-Making):** Human-readable explanations are generated and presented to the recruiter for every automated screening decision, architecturally satisfying the transparency principle of GDPR Article 22. The system is positioned for use in EU-regulated hiring contexts where automated decisions affecting candidates must be accompanied by meaningful explanations.
- **GDPR Data Subject Rights (Future Scope):** A full production deployment subject to GDPR would require implementation of: (a) data subject access request (DSAR) handling to allow candidates to request their stored data; (b) a right-to-erasure mechanism to permanently delete a specific candidate's data from the system; (c) a policy governing the retention period of uploaded resumes and screening results. These mechanisms are not implemented in the current prototype.
- **Data Minimisation:** The system collects from candidate resumes only the information directly necessary for computing a job match: name, email, phone, skills, education, experience, projects, and certifications. No sensitive personal attributes (e.g., age, gender, nationality, photograph, marital status) are extracted, stored, or considered in the scoring computation, consistent with GDPR's data minimisation principle.
- **Equal Opportunity Compliance:** The scoring dimensions (skills, experience, education, projects, certifications) are defined entirely in terms of professional qualifications. The system does not extract, store, or use any personally sensitive attributes in its screening logic. Organisations deploying HireLens AI remain responsible for ensuring that their job descriptions and selection thresholds do not indirectly create disparate impact under applicable equal opportunity employment laws.
- **Open-Source Licence Compliance:** All software libraries used by HireLens AI are governed by open-source licences (MIT, Apache 2.0, BSD-3-Clause). Commercial deployment of the system must comply with the terms of each dependency's licence, particularly Apache 2.0 requirements for attribution and state-change notices in redistributed binaries.
- **Candidate Data Consent:** In a production deployment where actual candidate resumes are processed, a consent mechanism informing candidates that their resume data will be processed by an automated AI system shall be implemented at the point of resume submission, consistent with GDPR Article 13 disclosure requirements.

---

### 5.4 REUSE OBJECTIVES

- **AI Module Reusability:** Each of the six AI pipeline modules (`resume_parser`, `job_parser`, `feature_extractor`, `matching_engine`, `explainability`, `comparison`) is implemented as an independent Python package with a strictly typed function interface. Each module can be imported and used independently in other Python applications, automated testing harnesses, or data processing scripts without requiring the FastAPI application server or React frontend.
- **Pydantic Schema Reuse:** The Pydantic schemas defined in `backend/schemas/schemas.py` (`ResumeResponse`, `JobDescriptionResponse`, `ScreeningResultResponse`, `CompareResponse`, `MatchRequest`, etc.) can be reused as contract definitions for any future client implementation (mobile app, desktop app, third-party integration) consuming the HireLens AI REST API.
- **Frontend Component Reuse:** The shared UI components (`ScoreGauge`, `FeatureBars`, `ExplanationPanel`, `SkillTags`) are implemented as stateless React functional components accepting all data via props. They have no implicit dependency on any specific page's state or routing, making them directly reusable in other React applications that need to visualise candidate evaluation data.
- **Skill Ontology Reuse:** The `KNOWN_SKILLS` dictionary defined in the resume parser module represents a standalone, curated technical skill ontology. It can be extracted and reused as a reference vocabulary for other HR technology applications, job board taxonomies, or skill-gap analysis tools without modification.
- **REST API as Integration Point:** The FastAPI backend serves as a reusable service that can be integrated into larger HR platform ecosystems. Any system capable of making HTTP requests can consume the 12 API endpoints to drive resume parsing, matching, or comparison functionality without accessing the AI source code directly.
- **Configuration Template Reuse:** The `backend/core/config.py` file serves as a documented, parameterised template for the system's operational settings. Its structure (centralised constants covering database, file storage, CORS, AI weights, threshold) can be reused as an architectural pattern for other configurable AI application backends.

---

### 5.5 DEVELOPMENT ENVIRONMENT REQUIREMENTS

- **Python Environment:** A Python 3.10 or higher installation is required. Use of a Python virtual environment (`python -m venv venv` or `conda create`) is strongly recommended to isolate the project's dependencies from the system Python installation. All backend dependencies shall be installed from `requirements.txt` using `pip install -r requirements.txt`.
- **spaCy Language Model:** Following package installation, the spaCy English language model must be downloaded separately via `python -m spacy download en_core_web_sm`. Without this model, any import of the spaCy NLP pipeline will raise a `RuntimeError` at module load time.
- **Node.js Environment:** Node.js 18.0.0 or higher and npm are required for the frontend. Frontend dependencies shall be installed by running `npm install` within the `frontend/` directory. The Vite development server shall be started with `npm run dev`.
- **Backend Server Launch:** The FastAPI backend shall be started using `uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000` from the project root directory. The `--reload` flag enables hot-reload on source file changes during development.
- **Directory Structure:** The project root must contain the following directories at minimum for correct operation: `ai/` (AI modules), `backend/` (API and models), `frontend/` (React application), `data/resumes/` (file storage, created automatically), `database/` (SQLite file location, created automatically by SQLAlchemy on first startup).
- **IDE Recommendation:** Visual Studio Code with the Python extension (ms-python.python), ESLint extension, and Prettier extension is recommended as the development environment. The project root should be opened as the workspace to enable correct import resolution for both Python and JavaScript modules.
- **Version Control:** Git is used for source version control. A `.gitignore` file should exclude the Python virtual environment directory, `node_modules/`, `data/resumes/` (uploaded files), `database/hirelens.db` (database file), and any `.env` files containing environment-specific configuration.
- **Environment Variables:** The `DATABASE_URL` and `UPLOAD_DIR` configuration values in `backend/core/config.py` are designed to support override via environment variables, enabling different database paths and storage locations for development, testing, and production environments without code modifications.

---

### 5.6 DOCUMENTATION REQUIREMENTS

- **API Documentation:** The FastAPI framework automatically generates interactive OpenAPI (Swagger UI) documentation at `http://localhost:8000/docs` and ReDoc documentation at `http://localhost:8000/redoc`. These endpoints are available in development mode and document all 12 API endpoints with request schemas, response schemas, and example payloads derived from the Pydantic model definitions.
- **Source Code Comments:** All AI pipeline functions shall include docstrings describing their input parameters, return value structure, and algorithmic logic at a level of detail sufficient for a developer unfamiliar with the module to understand its operation. Critical regex patterns and scoring formulas within function bodies shall be accompanied by inline comments explaining their purpose.
- **Configuration Documentation:** The `backend/core/config.py` file shall include inline comments explaining the purpose, valid range, and effect of each configurable parameter, with particular emphasis on the `MATCHING_WEIGHTS` dictionary (explaining what each key represents and how changing it affects scoring), and the `SELECTION_THRESHOLD` (explaining its role in the prediction step).
- **SRS Document (This Document):** This Software Requirements Specification serves as the primary requirements reference document. It shall be maintained in synchrony with the implemented system and updated whenever functional requirements change, new constraints are identified, or the system scope is modified.
- **Project Report:** A separate Project Documentation Report covering Introduction, Literature Survey, System Design (with UML diagrams), Implementation, System Testing, and Conclusion has been generated as a companion document to this SRS, providing broader academic and technical context for the project.
- **README:** A `README.md` file in the project root shall document: project overview; prerequisites (Python version, Node.js version); step-by-step installation instructions for both backend and frontend; instructions for starting the backend and frontend development servers; a list of available API endpoints with brief descriptions; and known limitations.

---

## 6. REFERENCES

1. IEEE Computer Society. (2011). *IEEE Std 830-1998 (Reaffirmed 2009): IEEE Recommended Practice for Software Requirements Specifications*. IEEE Standards Association.

2. Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). "Why Should I Trust You?": Explaining the Predictions of Any Classifier. *Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining*, pp. 1135–1144. https://doi.org/10.1145/2939672.2939778

3. Lundberg, S. M., & Lee, S.-I. (2017). A Unified Approach to Interpreting Model Predictions. *Advances in Neural Information Processing Systems (NeurIPS 2017)*, 30, pp. 4765–4774.

4. Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks. *Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing (EMNLP 2019)*, pp. 3982–3992. https://doi.org/10.18653/v1/D19-1410

5. Faliagka, E., Tsakalidis, A., & Tzimas, G. (2012). An Integrated e-Recruitment System for Automated Personality Mining and Applicant Ranking. *Internet Research*, 22(5), pp. 551–568. https://doi.org/10.1108/10662241211271545

6. Bogen, M., & Rieke, A. (2018). *Help Wanted: An Examination of Hiring Algorithms, Equity, and Bias*. Upturn. Retrieved from https://upturn.org/work/help-wanted/

7. European Commission. (2016). *Regulation (EU) 2016/679 of the European Parliament and of the Council (GDPR) — Article 22: Automated Individual Decision-Making, Including Profiling*. Official Journal of the European Union, L 119, pp. 1–88.

8. Ramírez, S. (2024). *FastAPI Documentation — Building APIs with Python*. Retrieved from https://fastapi.tiangolo.com/

9. Explosion AI. (2024). *spaCy: Industrial-Strength Natural Language Processing in Python*. Retrieved from https://spacy.io/

10. Singer-Vine, J. (2024). *pdfplumber: Plumb a PDF for Detailed Information about Each Text Character, Rectangle, and Line*. Retrieved from https://github.com/jsvine/pdfplumber

---

*End of Document*
