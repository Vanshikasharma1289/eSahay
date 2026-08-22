const Case = require('../models/Case');

// @route   POST /api/cases
// @desc    Save a generated/edited case
// @access  Private
const createCase = async (req, res) => {
  try {
    const {
      title,
      category,
      extractedDetails,
      applicableRights,
      designatedAuthority,
      actionSteps,
      draftDocument,
    } = req.body;

    if (!title || !draftDocument) {
      return res.status(400).json({
        success: false,
        message: 'Title and draft document are required to save a case',
      });
    }

    const newCase = await Case.create({
      user: req.user._id,
      title,
      category: category || 'Other',
      extractedDetails: extractedDetails || {},
      applicableRights: applicableRights || [],
      designatedAuthority: designatedAuthority || {},
      actionSteps: actionSteps || [],
      draftDocument,
    });

    res.status(201).json({
      success: true,
      case: newCase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/cases
// @desc    Get all cases for logged in citizen
// @access  Private
const getUserCases = async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/cases/:id
// @desc    Get single case by ID
// @access  Private
const getCaseById = async (req, res) => {
  try {
    const singleCase = await Case.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!singleCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    res.status(200).json({
      success: true,
      case: singleCase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/cases/:id/status
// @desc    Toggle case resolved status
// @access  Private
const updateCaseStatus = async (req, res) => {
  try {
    const singleCase = await Case.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!singleCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    singleCase.isResolved = req.body.isResolved !== undefined ? req.body.isResolved : !singleCase.isResolved;
    await singleCase.save();

    res.status(200).json({
      success: true,
      case: singleCase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCase,
  getUserCases,
  getCaseById,
  updateCaseStatus,
};