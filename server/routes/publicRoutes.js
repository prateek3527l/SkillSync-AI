const express = require('express');
const router = express.Router();
const { getPublicPortfolio } = require('../controllers/publicController');

// All routes here are strictly PUBLIC (no auth middleware)
router.get('/portfolio/:username', getPublicPortfolio);

module.exports = router;
