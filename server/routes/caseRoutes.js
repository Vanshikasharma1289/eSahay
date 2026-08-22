const express = require('express');
const router = express.Router();
const {
  createCase,
  getUserCases,
  getCaseById,
  updateCaseStatus,
} = require('../controllers/caseController');
const { protect } = require('../middleware/authMiddleware');

// All case routes require authentication
router.use(protect);

router.route('/')
  .post(createCase)
  .get(getUserCases);

router.route('/:id')
  .get(getCaseById);

router.route('/:id/status')
  .patch(updateCaseStatus);

module.exports = router;