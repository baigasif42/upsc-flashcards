// backend/controllers/userController.js
const User = require('../models/userModel');

// Get or create user by deviceId
exports.getOrCreateUser = async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required' });
    }
    
    let user = await User.findOne({ deviceId });
    
    if (!user) {
      user = new User({
        deviceId,
        progress: [],
        settings: {
          dailyGoal: 10,
          notificationsEnabled: true
        }
      });
      
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user progress
exports.updateProgress = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { topic, flashcardsCompleted, totalFlashcards } = req.body;
    
    if (!deviceId || !topic) {
      return res.status(400).json({ message: 'Device ID and topic are required' });
    }
    
    const user = await User.findOne({ deviceId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the topic in progress array
    const topicIndex = user.progress.findIndex(p => p.topic === topic);
    
    if (topicIndex !== -1) {
      // Update existing topic progress
      user.progress[topicIndex].flashcardsCompleted = flashcardsCompleted;
      user.progress[topicIndex].totalFlashcards = totalFlashcards;
      user.progress[topicIndex].lastReviewDate = Date.now();
    } else {
      // Add new topic progress
      user.progress.push({
        topic,
        flashcardsCompleted,
        totalFlashcards,
        lastReviewDate: Date.now()
      });
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { dailyGoal, notificationsEnabled } = req.body;
    
    const user = await User.findOne({ deviceId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (dailyGoal !== undefined) {
      user.settings.dailyGoal = dailyGoal;
    }
    
    if (notificationsEnabled !== undefined) {
      user.settings.notificationsEnabled = notificationsEnabled;
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
