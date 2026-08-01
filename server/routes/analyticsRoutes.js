const express = require('express');
const router = express.Router();
const {
  getOverview,
  getInterviewAnalytics,
  getJobAnalytics,
  getActivityTimeline,
  getGoals
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/overview', protect, getOverview);
router.get('/interviews', protect, getInterviewAnalytics);
router.get('/jobs', protect, getJobAnalytics);
router.get('/activity', protect, getActivityTimeline);
router.get('/goals', protect, getGoals);

module.exports = router;
