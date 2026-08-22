const express = require('express');

const router = express.Router();

const {
  analyzeLegalIssue,
  chatWithAssistant,
} = require('../controllers/aiController');

const { protect } = require('../middleware/authMiddleware');

// Case analysis
router.post('/analyze', protect, analyzeLegalIssue);

// Voice / conversational assistant
router.post('/chat', protect, chatWithAssistant);

module.exports = router;