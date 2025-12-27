import express from 'express';
import Bid from '../models/Bid.js';
import Job from '../models/Job.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import Joi from 'joi';

const router = express.Router();

// Validation schema
const bidSchema = Joi.object({
  jobId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  message: Joi.string().min(10).required(),
});

// Place a bid (Freelancer only)
router.post('/', authenticateToken, authorizeRoles('freelancer'), async (req, res) => {
  try {
    const { error, value } = bidSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { jobId, amount, message } = value;

    // Validate ObjectId format
    if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not accepting bids' });
    }

    // Check if freelancer already placed a bid
    const existingBid = await Bid.findOne({ jobId, freelancerId: req.user._id });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this job' });
    }

    // Create bid
    const bid = new Bid({
      jobId,
      freelancerId: req.user._id,
      amount,
      message,
    });

    await bid.save();
    await bid.populate('freelancerId', 'name email skills bio');
    await bid.populate('jobId', 'title budget');

    res.status(201).json({ message: 'Bid placed successfully', bid });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get freelancer's bids
router.get('/my-bids', authenticateToken, authorizeRoles('freelancer'), async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('jobId', 'title budget category status clientId')
      .populate({
        path: 'jobId',
        populate: { path: 'clientId', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.json({ bids });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bids for a specific job
router.get('/job/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Validate ObjectId format
    if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only client who posted can see bids
    if (job.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bids = await Bid.find({ jobId })
      .populate('freelancerId', 'name email skills bio')
      .sort({ createdAt: -1 });

    res.json({ bids });
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Hire freelancer (Accept bid - Client only)
router.put('/:id/hire', authenticateToken, authorizeRoles('client'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid bid ID format' });
    }

    const bid = await Bid.findById(id).populate('jobId');
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    if (!bid.jobId) {
      return res.status(404).json({ message: 'Job not found for this bid' });
    }

    const job = bid.jobId;

    // Check if client owns the job
    if (job.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not open for hiring' });
    }

    // Accept this bid
    bid.status = 'accepted';
    await bid.save();

    // Reject all other bids for this job
    await Bid.updateMany(
      { jobId: job._id, _id: { $ne: bid._id } },
      { status: 'rejected' }
    );

    // Update job status to hired
    job.status = 'hired';
    await job.save();

    const updatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email skills bio')
      .populate('jobId', 'title budget');

    res.json({ message: 'Freelancer hired successfully', bid: updatedBid, job });
  } catch (error) {
    console.error('Hire freelancer error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

