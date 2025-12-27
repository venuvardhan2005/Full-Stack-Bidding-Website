import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validate userId in token
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token format.' });
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

