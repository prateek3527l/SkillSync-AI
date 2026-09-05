const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getResume,
  downloadResume,
  deleteResume,
  analyzeResume,
  getAnalysis,
  deleteAnalysis,
  analyzeResumePython,
  getPythonRoles
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protect, getResume)
  .delete(protect, deleteResume);

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/download', protect, downloadResume);

router.get('/python-roles', protect, getPythonRoles);
router.post('/analyze-python', protect, upload.single('resume'), analyzeResumePython);

router.route('/analysis')
  .get(protect, getAnalysis)
  .post(protect, analyzeResume)
  .delete(protect, deleteAnalysis);

module.exports = router;