// backend/controllers/flashcardController.js
const Flashcard = require('../models/flashcardModel');
const { OpenAI } = require('openai');

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Get all flashcards
exports.getFlashcards = async (req, res) => {
  try {
    const { topic } = req.query;
    const query = topic ? { topic } : {};
    
    const flashcards = await Flashcard.find(query);
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single flashcard
exports.getFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create AI-generated flashcards
exports.createAIFlashcards = async (req, res) => {
  try {
    const { topic, count = 5 } = req.body;
    
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }
    
    // Generate flashcards using OpenAI
    const prompt = `Create ${count} detailed flashcards for UPSC exam preparation on the topic "${topic}". 
    Each flashcard should have a question that tests important knowledge for the UPSC exam and a comprehensive answer. 
    Return the output as a JSON array of objects, each with "question" and "answer" fields.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a UPSC exam preparation expert. Create concise but comprehensive flashcards with factually accurate information." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const responseData = JSON.parse(completion.choices[0].message.content);
    const flashcardsData = responseData.flashcards || [];
    
    // Save the flashcards to the database
    const flashcards = [];
    for (const cardData of flashcardsData) {
      const newFlashcard = new Flashcard({
        question: cardData.question,
        answer: cardData.answer,
        topic: topic,
        difficulty: cardData.difficulty || 'medium'
      });
      
      const savedCard = await newFlashcard.save();
      flashcards.push(savedCard);
    }
    
    res.status(201).json(flashcards);
  } catch (error) {
    console.error('Error creating AI flashcards:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a flashcard manually
exports.createFlashcard = async (req, res) => {
  try {
    const { question, answer, topic, difficulty } = req.body;
    
    if (!question || !answer || !topic) {
      return res.status(400).json({ message: 'Question, answer, and topic are required' });
    }
    
    const newFlashcard = new Flashcard({
      question,
      answer,
      topic,
      difficulty: difficulty || 'medium'
    });
    
    const savedFlashcard = await newFlashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findByIdAndDelete(req.params.id);
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
