import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('client', 'freelancer').required(),
  skills: Joi.array().items(Joi.string()).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, role, skills } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role,
      skills: skills || [],
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is blocked
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked. Please contact admin.' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, bio, skills } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills && Array.isArray(skills)) user.skills = skills;

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

