from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from pydantic import BaseModel
import uvicorn

from analyzer import analyze_resume_skills, JOB_ROLE_REQUIREMENTS

app = FastAPI(
    title="SkillSync AI - Resume Skill Analyzer Service",
    description="Python microservice for PDF resume text extraction and skill gap analysis",
    version="1.0.0"
)

# CORS Middleware
allowed_origins = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisResponse(BaseModel):
    target_role: str
    match_percentage: int
    detected_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[Dict[str, Any]]
    total_required: int
    total_matched: int

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "SkillSync AI - Python Resume Analyzer",
        "supported_roles": list(JOB_ROLE_REQUIREMENTS.keys())
    }

@app.get("/roles")
def get_supported_roles():
    return {
        "roles": list(JOB_ROLE_REQUIREMENTS.keys()),
        "role_requirements": JOB_ROLE_REQUIREMENTS
    }

@app.post("/analyze-resume", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    target_role: str = Form(...)
):
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF files are supported."
        )

    try:
        pdf_bytes = await resume.read()
        if not pdf_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )
            
        result = analyze_resume_skills(pdf_bytes, target_role)
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during resume analysis: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
