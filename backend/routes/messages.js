import express from 'express';
import Message from '../models/Message.js';
import Job from '../models/Job.js';
import Bid from '../models/Bid.js';
import { authenticateToken } from '../middleware/auth.js';
import Joi from 'joi';

const router = express.Router();

const messageSchema = Joi.object({
  jobId: Joi.string().required(),
  receiverId: Joi.string().required(),
  message: Joi.string().min(1).required(),
});

// Get messages for a job
router.get('/job/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Validate ObjectId format first
    if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is part of this job (client or freelancer with accepted bid)
    const isClient = job.clientId.toString() === req.user._id.toString();
    
    if (!isClient) {
      // Check if freelancer has an accepted bid
      const acceptedBid = await Bid.findOne({
        jobId: req.params.jobId,
        freelancerId: req.user._id,
        status: 'accepted',
      });
      
      if (!acceptedBid) {
        // Job exists but user doesn't have access - return 403 (not 404)
        return res.status(403).json({ message: 'Access denied. You are not authorized to view messages for this job.' });
      }
    }

    const messages = await Message.find({ jobId })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { jobId, receiverId, message } = value;

    // Validate ObjectId formats
    if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }
    if (!receiverId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid receiver ID format' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify user can send message (client or freelancer with accepted bid)
    const isClient = job.clientId.toString() === req.user._id.toString();
    
    if (!isClient) {
      const acceptedBid = await Bid.findOne({
        jobId,
        freelancerId: req.user._id,
        status: 'accepted',
      });
      
      if (!acceptedBid) {
        return res.status(403).json({ message: 'Access denied. Only hired freelancers can message.' });
      }
    }

    const newMessage = new Message({
      jobId,
      senderId: req.user._id,
      receiverId,
      message,
    });

    await newMessage.save();
    await newMessage.populate('senderId', 'name email');
    await newMessage.populate('receiverId', 'name email');

    res.status(201).json({ message: 'Message sent successfully', messageData: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

