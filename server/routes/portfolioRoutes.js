const express = require('express');
const router = express.Router();
const { getPortfolioSettings, updatePortfolioSettings } = require('../controllers/publicController');
const { protect } = require('../middleware/authMiddleware');

router.route('/settings')
  .get(protect, getPortfolioSettings)
  .put(protect, updatePortfolioSettings);

module.exports = router;
