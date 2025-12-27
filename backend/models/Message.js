import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;


