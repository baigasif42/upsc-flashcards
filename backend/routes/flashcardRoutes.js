// backend/routes/flashcardRoutes.js
const express = require('express');
const flashcardController = require('../controllers/flashcardController');

const router = express.Router();

router.get('/', flashcardController.getFlashcards);
router.get('/:id', flashcardController.getFlashcard);
router.post('/', flashcardController.createFlashcard);
router.post('/generate', flashcardController.createAIFlashcards);
router.delete('/:id', flashcardController.deleteFlashcard);

module.exports = router;
