const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const { extractTextFromPDF, analyzeWithGemini } = require('../services/ai/resumeAnalyzer');

// @desc    Upload or Replace Resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }

    // Check if user already has a resume
    const existingResume = await Resume.findOne({ userId: req.user.id });

    if (existingResume) {
      // Delete old file from disk
      const oldFilePath = path.join(__dirname, '..', 'uploads', existingResume.storedFileName);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      
      // Update DB record
      existingResume.originalFileName = req.file.originalname;
      existingResume.storedFileName = req.file.filename;
      existingResume.fileUrl = `/uploads/${req.file.filename}`;
      existingResume.fileSize = req.file.size;
      existingResume.uploadDate = Date.now();
      
      const updatedResume = await existingResume.save();
      return res.status(200).json(updatedResume);
    }

    // Create new resume record
    const newResume = await Resume.create({
      userId: req.user.id,
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
    });

    res.status(201).json(newResume);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Resume Metadata
// @route   GET /api/resume
// @access  Private
const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    
    if (!resume) {
      return res.status(200).json(null);
    }
    
    res.status(200).json(resume);
  } catch (error) {
    next(error);
  }
};

// @desc    Download Resume
// @route   GET /api/resume/download
// @access  Private
const downloadResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    const filePath = path.join(__dirname, '..', 'uploads', resume.storedFileName);
    
    if (fs.existsSync(filePath)) {
      res.download(filePath, resume.originalFileName);
    } else {
      res.status(404);
      throw new Error('File not found on server');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Resume
// @route   DELETE /api/resume
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Delete physical file
    const filePath = path.join(__dirname, '..', 'uploads', resume.storedFileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete DB record
    await resume.deleteOne();

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze uploaded resume
// @route   POST /api/resume/analyze
// @access  Private
const analyzeResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    
    if (!resume) {
      res.status(404);
      throw new Error('No resume found to analyze. Please upload one first.');
    }

    const filePath = path.join(__dirname, '..', 'uploads', resume.storedFileName);
    if (!fs.existsSync(filePath)) {
      res.status(404);
      throw new Error('Resume file not found on server.');
    }

    // Extract text
    const text = await extractTextFromPDF(filePath);
    
    if (!text || text.trim().length === 0) {
      res.status(400);
      throw new Error('Could not extract text from the PDF. It might be scanned or empty.');
    }

    // Call AI Service
    const analysisResult = await analyzeWithGemini(text);
    
    // Save to DB
    resume.analysis = {
      ...analysisResult,
      lastAnalyzedAt: Date.now()
    };
    resume.resumeScore = analysisResult.overallScore || 0; // update main score field
    await resume.save();

    res.status(200).json(resume.analysis);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Resume Analysis
// @route   GET /api/resume/analysis
// @access  Private
const getAnalysis = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume || !resume.analysis) {
      return res.status(200).json(null);
    }
    res.status(200).json(resume.analysis);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear Resume Analysis
// @route   DELETE /api/resume/analysis
// @access  Private
const deleteAnalysis = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (resume) {
      resume.analysis = undefined;
      resume.resumeScore = 0;
      await resume.save();
    }
    res.status(200).json({ message: 'Analysis cleared' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get python service supported roles
// @route   GET /api/resume/python-roles
// @access  Private
const getPythonRoles = async (req, res, next) => {
  try {
    const axios = require('axios');
    const pythonUrl = process.env.PYTHON_AI_URL || 'http://localhost:8000';
    const response = await axios.get(`${pythonUrl}/roles`, { timeout: 5000 });
    return res.status(200).json(response.data);
  } catch (error) {
    // Return fallback list of roles if Python microservice is currently unreachable
    return res.status(200).json({
      roles: [
        'Full Stack Developer',
        'Backend Developer',
        'Frontend Developer',
        'Software Developer',
        'Python Developer'
      ],
      serviceAvailable: false
    });
  }
};

// @desc    Analyze resume using Python FastAPI service
// @route   POST /api/resume/analyze-python
// @access  Private
const analyzeResumePython = async (req, res, next) => {
  try {
    const axios = require('axios');
    const FormData = require('form-data');
    const targetRole = req.body.target_role || req.body.targetRole;

    if (!targetRole) {
      res.status(400);
      throw new Error('Please select or specify a target job role.');
    }

    let filePath = null;
    let fileName = null;
    let resumeRecord = null;

    // Case 1: Fresh file uploaded in request body
    if (req.file) {
      filePath = req.file.path;
      fileName = req.file.originalname;

      // Save/update user's stored resume
      const existingResume = await Resume.findOne({ userId: req.user.id });
      if (existingResume) {
        const oldFilePath = path.join(__dirname, '..', 'uploads', existingResume.storedFileName);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
        existingResume.originalFileName = req.file.originalname;
        existingResume.storedFileName = req.file.filename;
        existingResume.fileUrl = `/uploads/${req.file.filename}`;
        existingResume.fileSize = req.file.size;
        existingResume.uploadDate = Date.now();
        resumeRecord = await existingResume.save();
      } else {
        resumeRecord = await Resume.create({
          userId: req.user.id,
          originalFileName: req.file.originalname,
          storedFileName: req.file.filename,
          fileUrl: `/uploads/${req.file.filename}`,
          fileSize: req.file.size,
        });
      }
    } else {
      // Case 2: Use existing uploaded resume
      resumeRecord = await Resume.findOne({ userId: req.user.id });
      if (!resumeRecord) {
        res.status(400);
        throw new Error('No resume file provided or existing in your profile. Please upload a PDF resume.');
      }
      filePath = path.join(__dirname, '..', 'uploads', resumeRecord.storedFileName);
      fileName = resumeRecord.originalFileName;
    }

    if (!fs.existsSync(filePath)) {
      res.status(404);
      throw new Error('Resume file not found on server.');
    }

    const pythonUrl = process.env.PYTHON_AI_URL || 'http://localhost:8000';
    const formData = new FormData();
    formData.append('resume', fs.createReadStream(filePath), {
      filename: fileName,
      contentType: 'application/pdf'
    });
    formData.append('target_role', targetRole);

    let pythonResponse;
    try {
      pythonResponse = await axios.post(`${pythonUrl}/analyze-resume`, formData, {
        headers: {
          ...formData.getHeaders()
        },
        timeout: 15000
      });
    } catch (pyError) {
      if (pyError.response) {
        res.status(pyError.response.status || 500);
        throw new Error(pyError.response.data?.detail || 'Python microservice error during analysis.');
      } else if (pyError.code === 'ECONNREFUSED' || pyError.code === 'ENOTFOUND') {
        res.status(503);
        throw new Error(`Python AI service is unreachable at ${pythonUrl}. Please ensure FastAPI is running.`);
      }
      throw pyError;
    }

    const analysisData = pythonResponse.data;

    // Update resume analysis details in database
    resumeRecord.analysis = {
      overallScore: analysisData.match_percentage,
      matchedSkills: analysisData.matched_skills,
      missingSkills: analysisData.missing_skills,
      detectedSkills: analysisData.detected_skills,
      recommendations: analysisData.recommendations.map(r => `${r.skill}: ${r.suggestion}`),
      targetRole: analysisData.target_role,
      lastAnalyzedAt: Date.now()
    };
    resumeRecord.resumeScore = analysisData.match_percentage;
    await resumeRecord.save();

    res.status(200).json(analysisData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getResume,
  downloadResume,
  deleteResume,
  analyzeResume,
  getAnalysis,
  deleteAnalysis,
  analyzeResumePython,
  getPythonRoles
};

