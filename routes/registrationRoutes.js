const express = require('express');
const router = express.Router();
const regController = require('../controllers/registrationController');
const { authenticate } = require('../middleware/authMiddleware');

// all routes require user
/**
 * @swagger
 * tags:
 *   name: Registrations
 *   description: Event registration endpoints
 */

/**
 * @swagger
 * /api/registrations/{eventId}:
 *   post:
 *     summary: Register for an event
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration created
 */
router.post('/:eventId', authenticate, regController.registerForEvent);
router.get('/me', authenticate, regController.getMyRegistrations);

module.exports = router;
