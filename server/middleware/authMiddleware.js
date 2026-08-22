const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if header contains "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token string after "Bearer "
      token = req.headers.authorization.split(' ')[1];

      const secret = process.env.JWT_SECRET || 'esahay_hackathon_super_secret_key_2026';
      const decoded = jwt.verify(token, secret);

      // Find user from database using decoded ID, exclude password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next(); // User is valid, continue to controller
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token expired or invalid' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };