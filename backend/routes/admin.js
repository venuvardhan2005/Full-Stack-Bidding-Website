import express from 'express';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Bid from '../models/Bid.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
    const totalJobs = await Job.countDocuments();

    const recentUsers = await User.find()
      .select('name email role status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentJobs = await Job.find()
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalClients,
        totalFreelancers,
        totalJobs,
      },
      recentUsers,
      recentJobs,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single user
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Block/Unblock user
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent blocking admin
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot block admin user' });
    }

    user.status = status;
    await user.save();

    res.json({ message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Force close job
router.put('/jobs/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.status = 'closed';
    await job.save();

    res.json({ message: 'Job closed successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }

    // Delete user's jobs and bids
    await Job.deleteMany({ clientId: user._id });
    await Bid.deleteMany({ freelancerId: user._id });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

