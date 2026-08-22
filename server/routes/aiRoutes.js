const express = require('express');
const router = express.Router();
const { analyzeLegalIssue } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Protected route: user must be logged in to analyze
router.post('/analyze', protect, analyzeLegalIssue);

module.exports = router;