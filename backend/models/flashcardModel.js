// backend/models/flashcardModel.js
const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
