# SkillSync AI - Python Resume Analyzer

## Overview

Add a Python FastAPI microservice to the existing SkillSync AI application.

The existing Node.js/Express backend must remain the main backend. Python will be used specifically for resume parsing, skill extraction, skill-gap analysis, and recommendations.

Do not rewrite or remove existing functionality.

## Task 1: Analyze Existing Project

Inspect the complete existing SkillSync AI project.

Understand:
- Frontend structure
- Node.js/Express backend
- MongoDB integration
- Existing routes
- Existing controllers
- Existing authentication
- Existing resume functionality
- Existing UI components

Do not modify anything unnecessarily.

Document the relevant architecture before implementing the new feature.

## Task 2: Create Python AI Service

Create an `ai-service` directory.

Use:
- Python
- FastAPI
- Uvicorn
- pypdf

Create:
- main.py
- analyzer.py
- requirements.txt

Create a FastAPI service that can receive a resume PDF and target job role.

## Task 3: Resume Text Extraction

Implement PDF resume text extraction using Python.

The service should:
- Accept PDF uploads
- Extract text from every page
- Handle empty or invalid PDFs
- Return meaningful errors when extraction fails

## Task 4: Skill Extraction

Implement skill detection from extracted resume text.

Support common skills including:
- Python
- Java
- C++
- JavaScript
- React
- Node.js
- Express.js
- MongoDB
- SQL
- MySQL
- Git
- Docker
- AWS
- REST APIs
- HTML
- CSS

Make the skill detection modular so more skills can easily be added later.

## Task 5: Job Role Skill Requirements

Create a simple role-to-skills configuration for roles such as:

- Full Stack Developer
- Backend Developer
- Frontend Developer
- Software Developer
- Python Developer

Each role should have a list of expected skills.

## Task 6: Skill Gap Analysis

Compare the skills detected in the resume with the requirements of the selected role.

Return:
- Match percentage
- Matched skills
- Missing skills

Example:

Target Role:
Backend Developer

Matched:
Node.js
MongoDB
REST APIs

Missing:
Docker
AWS
Redis

Match:
60%

## Task 7: Recommendations

Generate learning recommendations based on missing skills.

Prioritize the most important missing skills.

Return recommendations as structured JSON.

## Task 8: FastAPI Endpoint

Create:

POST /analyze-resume

The endpoint should accept:
- Resume PDF
- Target job role

Return JSON containing:

{
  "match_percentage": 0,
  "detected_skills": [],
  "matched_skills": [],
  "missing_skills": [],
  "recommendations": []
}

## Task 9: Node.js Integration

Integrate the Python service with the existing Node.js/Express backend.

The flow must be:

Frontend
→ Node.js/Express
→ Python FastAPI
→ Analysis
→ Node.js/Express
→ Frontend

Do not make the frontend directly depend on the Python service unless absolutely necessary.

Use an environment variable:

PYTHON_AI_URL=http://localhost:8000

Do not hardcode service configuration.

## Task 10: Frontend Integration

Add the resume analyzer functionality to the existing SkillSync AI UI.

The user should be able to:

1. Upload a resume
2. Select/enter a target role
3. Start analysis
4. See loading state
5. See match percentage
6. See detected skills
7. See matched skills
8. See missing skills
9. See recommendations

Follow the existing SkillSync AI design.

Do not redesign unrelated parts of the application.

## Task 11: Error Handling

Handle:
- Invalid files
- Non-PDF files
- Empty resumes
- PDF extraction failures
- Python service unavailable
- Node.js to Python communication failures
- Invalid target roles
- Invalid API responses

Display user-friendly error messages.

## Task 12: Testing

Test the complete flow:

PDF Resume
→ Frontend
→ Node.js
→ Python FastAPI
→ Resume Analysis
→ Node.js
→ Frontend

Fix any issues found.

## Task 13: Documentation

Update README.md with:

- Python requirements
- Python virtual environment setup
- Installing requirements
- Starting FastAPI
- Starting Node.js
- Environment variables
- Complete project architecture
- How Node.js communicates with Python

## Task 14: Final Verification

Verify that:
- Existing features still work
- Existing frontend still works
- Existing Node.js backend still works
- MongoDB functionality still works
- Python service works
- Resume analysis works
- Node.js/Python communication works
- No unnecessary files were changed

When all tasks are complete, document the final implementation in progress.txt.
