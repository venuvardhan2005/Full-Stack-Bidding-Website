import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be greater than 0'],
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'hired', 'completed', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;


