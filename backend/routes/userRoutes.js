// backend/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/:deviceId', userController.getOrCreateUser);
router.put('/:deviceId/progress', userController.updateProgress);
router.put('/:deviceId/settings', userController.updateSettings);

module.exports = router;
