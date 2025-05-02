// backend/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  progress: [
    {
      topic: {
        type: String,
        required: true
      },
      flashcardsCompleted: {
        type: Number,
        default: 0
      },
      totalFlashcards: {
        type: Number,
        default: 0
      },
      lastReviewDate: {
        type: Date,
        default: Date.now
      }
    }
  ],
  settings: {
    dailyGoal: {
      type: Number,
      default: 10
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    }
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
