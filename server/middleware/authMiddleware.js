const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  console.log('Auth middleware triggered');
  let token = req.header('x-auth-token');
  
  // Check for Authorization header if x-auth-token is not present
  if (!token) {
    const authHeader = req.header('Authorization');
    token = authHeader && authHeader.split(' ')[1];
  }
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  console.log('Token received:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Check if token is expired
    if (decoded.exp < Date.now() / 1000) {
      console.log('Token has expired');
      return res.status(401).json({ msg: 'Token has expired' });
    }
    
    // Attach user to request object
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      console.log('User not found for id:', decoded.user.id);
      return res.status(401).json({ msg: 'User not found' });
    }
    
    console.log('User found:', user.username);
    req.user = user;
    
    next();
  } catch (err) {
    console.error('Error in auth middleware:', err);

    if (err.name === 'JsonWebTokenError') {
      console.log('Invalid token');
      return res.status(401).json({ msg: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
      console.log('Token expired');
      return res.status(401).json({ msg: 'Token has expired' });
    }

    console.error('Unexpected error in auth middleware:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = authMiddleware;