const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Creates a token containing the user's Mongo ID that lasts 7 days
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'esahay_hackathon_super_secret_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: '7d',
  });
};

// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, preferredLanguage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    // Check if citizen already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Create new citizen profile
    const user = await User.create({
      name,
      email,
      password,
      preferredLanguage: preferredLanguage || 'en',
    });

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Validate password using our model helper
    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          token: generateToken(user._id),
        },
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/auth/profile
// @access  Private (Needs Token)
const getUserProfile = async (req, res) => {
  try {
    // req.user was populated by our protect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };