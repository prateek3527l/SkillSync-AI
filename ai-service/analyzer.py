import re
from typing import List, Dict, Any
from pypdf import PdfReader
import io

# Pre-configured job roles and required skills
JOB_ROLE_REQUIREMENTS: Dict[str, List[str]] = {
    "Full Stack Developer": [
        "JavaScript", "React", "Node.js", "Express.js", "MongoDB", "HTML", "CSS", "REST APIs", "Git", "SQL"
    ],
    "Backend Developer": [
        "Python", "Java", "Node.js", "Express.js", "MongoDB", "SQL", "MySQL", "REST APIs", "Docker", "Git", "C++"
    ],
    "Frontend Developer": [
        "JavaScript", "React", "HTML", "CSS", "Git", "REST APIs"
    ],
    "Software Developer": [
        "Python", "Java", "C++", "SQL", "Git", "REST APIs", "Data Structures"
    ],
    "Python Developer": [
        "Python", "SQL", "MySQL", "REST APIs", "Git", "Docker", "MongoDB"
    ]
}

# Skill aliases / pattern mapping for modular matching
SKILL_PATTERNS: Dict[str, str] = {
    "Python": r"\bpython3?\b",
    "Java": r"\bjava\b(?!script)",
    "C++": r"\bc\+\+\b|\bcpp\b",
    "JavaScript": r"\bjavascript\b|\bjs\b|\bes6\b",
    "React": r"\breact(?:\.js)?\b",
    "Node.js": r"\bnode(?:\.js)?\b",
    "Express.js": r"\bexpress(?:\.js)?\b",
    "MongoDB": r"\bmongodb\b|\bmongo\b",
    "SQL": r"\bsql\b",
    "MySQL": r"\bmysql\b",
    "Git": r"\bgit\b|\bgithub\b|\bgitlab\b",
    "Docker": r"\bdocker\b",
    "AWS": r"\baws\b|\bamazon web services\b",
    "REST APIs": r"\brest\b|\brestful\b|\brest apis?\b|\bapi\b",
    "HTML": r"\bhtml5?\b",
    "CSS": r"\bcss3?\b",
    "Data Structures": r"\bdata structures\b|\balgorithms\b"
}

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extract text content from raw PDF bytes."""
    if not pdf_bytes or len(pdf_bytes) == 0:
        raise ValueError("Provided PDF file is empty.")

    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        extracted_text = []
        for index, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                extracted_text.append(text)

        full_text = "\n".join(extracted_text).strip()
        if not full_text:
            raise ValueError("Could not extract any readable text from the PDF. It may be scanned or image-only.")

        return full_text
    except Exception as e:
        if isinstance(e, ValueError):
            raise e
        raise ValueError(f"Failed to parse PDF document: {str(e)}")

def extract_skills_from_text(text: str) -> List[str]:
    """Scan text for predefined skills using regular expressions."""
    detected = []
    text_lower = text.lower()

    for skill, pattern in SKILL_PATTERNS.items():
        if re.search(pattern, text_lower, re.IGNORECASE):
            detected.append(skill)

    return detected

def analyze_resume_skills(pdf_bytes: bytes, target_role: str) -> Dict[str, Any]:
    """Extract text from resume, analyze skills against target role, and produce analysis & recommendations."""
    if not target_role or target_role.strip() not in JOB_ROLE_REQUIREMENTS:
        # Fallback to closest match or default if exact role not found
        available_roles = list(JOB_ROLE_REQUIREMENTS.keys())
        matched_role = next((r for r in available_roles if r.lower() == target_role.strip().lower()), None)
        if not matched_role:
            raise ValueError(f"Invalid target role '{target_role}'. Supported roles: {', '.join(available_roles)}")
        target_role = matched_role

    extracted_text = extract_text_from_pdf_bytes(pdf_bytes)
    detected_skills = extract_skills_from_text(extracted_text)

    required_skills = JOB_ROLE_REQUIREMENTS[target_role]
    matched_skills = [skill for skill in required_skills if skill in detected_skills]
    missing_skills = [skill for skill in required_skills if skill not in detected_skills]

    match_percentage = round((len(matched_skills) / len(required_skills)) * 100) if required_skills else 0

    # Build recommendations for missing skills
    recommendations = []
    for missing in missing_skills:
        recommendations.append({
            "skill": missing,
            "priority": "High" if missing in required_skills[:3] else "Medium",
            "suggestion": f"Build a practical project or complete a module focused on {missing} to improve your match score for {target_role}."
        })

    return {
        "target_role": target_role,
        "match_percentage": match_percentage,
        "detected_skills": detected_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendations": recommendations,
        "total_required": len(required_skills),
        "total_matched": len(matched_skills)
    }
