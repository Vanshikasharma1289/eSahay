const express = require("express");

const router = express.Router();

const {
  analyzeLegalIssue,
  chatWithAssistant,
  analyzeAuthorityResponse,
} = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

// Case analysis
router.post(
  "/analyze",
  protect,
  analyzeLegalIssue
);

// Voice / conversational assistant
router.post(
  "/chat",
  protect,
  chatWithAssistant
);

// Authority response / case follow-up analysis
router.post(
  "/analyze-response",
  protect,
  analyzeAuthorityResponse
);

module.exports = router;