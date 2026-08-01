const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Projects', 'Applications', 'Interviews', 'Resume', 'Learning', 'Other'],
      default: 'Other',
    },
    targetValue: {
      type: Number,
      required: true,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Abandoned'],
      default: 'In Progress',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
