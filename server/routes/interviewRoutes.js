const express = require('express');
const router = express.Router();
const {
  startInterview, submitAnswer, finishInterview,
  getHistory, getSessionDetail, deleteSession
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startInterview);
router.post('/answer', protect, submitAnswer);
router.post('/finish', protect, finishInterview);
router.get('/history', protect, getHistory);
router.route('/history/:id').get(protect, getSessionDetail).delete(protect, deleteSession);
router.get('/status', protect, (req, res) => {
  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  if (!hasKey) {
    return res.status(200).json({
      configured: false,
      message: 'AI provider not configured.'
    });
  }
  return res.status(200).json({ configured: true });
});

module.exports = router;