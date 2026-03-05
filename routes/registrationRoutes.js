const express = require('express');
const router = express.Router();
const regController = require('../controllers/registrationController');
const { authenticate } = require('../middleware/authMiddleware');

// all routes require user
router.post('/:eventId', authenticate, regController.registerForEvent);
router.get('/me', authenticate, regController.getMyRegistrations);

module.exports = router;
