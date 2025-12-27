import express from 'express';
import Job from '../models/Job.js';
import Bid from '../models/Bid.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import Joi from 'joi';

const router = express.Router();

// Validation schema
const jobSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  category: Joi.string().required(),
  description: Joi.string().min(10).required(),
  budget: Joi.number().positive().required(),
  // deadline: Joi.date().optional().allow(null),
  deadline: Joi.date().optional().allow(null, ''),

});

// Get all jobs (for freelancers to browse)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = 'open'; // Only show open jobs by default for browsing
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(filter)
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get client's jobs (must be before /:id route to avoid route conflict)
router.get('/client/my-jobs', authenticateToken, authorizeRoles('client'), async (req, res) => {
  try {
    const jobs = await Job.find({ clientId: req.user._id })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new job (Client only)
router.post('/', authenticateToken, authorizeRoles('client'), async (req, res) => {
  try {
    const { error, value } = jobSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newJob = new Job({
      ...value,
      clientId: req.user._id,
      status: 'open',
    });

    await newJob.save();
    
    const populatedJob = await newJob.populate('clientId', 'name email');
    
    res.status(201).json({ 
      message: 'Job posted successfully', 
      job: populatedJob 
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    const job = await Job.findById(id).populate('clientId', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job with bids
router.get('/:id/bids', authenticateToken, async (req, res) => {
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

    // Only client who posted can see bids
    if (job.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bids = await Bid.find({ jobId: id })
      .populate('freelancerId', 'name email skills bio')
      .sort({ createdAt: -1 });

    res.json({ job, bids });
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }
    
    if (!['open', 'hired', 'completed', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only client who posted or admin can update
    if (job.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    job.status = status;
    await job.save();

    res.json({ message: 'Job status updated', job });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (Client only)
router.delete('/:id', authenticateToken, authorizeRoles('client'), async (req, res) => {
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

    if (job.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete associated bids
    await Bid.deleteMany({ jobId: id });

    await Job.findByIdAndDelete(id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

