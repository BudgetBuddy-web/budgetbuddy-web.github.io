const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    trim: true
  },
  deadline: {
    type: Date
  },
  type: {
    type: String,
    enum: ['savings', 'budget'],
    default: 'budget'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
budgetSchema.index({ user: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
