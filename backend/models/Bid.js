import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [0, 'Amount must be greater than 0'],
    },
    message: {
      type: String,
      required: [true, 'Proposal message is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;


