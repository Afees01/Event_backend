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
 *     security:
 *       - bearerAuth: []
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

/**
 * @swagger
 * /api/registrations/{id}/update:
 *   post:
 *     summary: Update a registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *       200:
 *         description: Registration updated
 *       404:
 *         description: Not found
 */
router.post('/:id/update', authenticate, regController.updateRegistration);

/**
 * @swagger
 * /api/registrations/{id}/delete:
 *   post:
 *     summary: Cancel a registration (soft delete)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registration cancelled
 *       404:
 *         description: Not found
 */
router.post('/:id/delete', authenticate, regController.deleteRegistration);

/**
 * @swagger
 * /api/registrations/me:
 *   get:
 *     summary: Get my registrations
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registrations
 */
router.get('/me', authenticate, regController.getMyRegistrations);
module.exports = router;
