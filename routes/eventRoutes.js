const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// public
/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management and retrieval
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Not found
 */
router.get('/:id', eventController.getEventById);

// admin-only
/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created
 */
router.post('/', authenticate, requireAdmin, eventController.createEvent);

/**
 * @swagger
 * /api/events/{id}/update:
 *   post:
 *     summary: Update an event
 *     tags: [Events]
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
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated
 *       404:
 *         description: Not found
 */
router.post('/:id/update', authenticate, requireAdmin, eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}/delete:
 *   post:
 *     summary: Delete an event(soft delete)
 *     tags: [Events]
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
 *         description: Event deleted
 *       404:
 *         description: Not found
 */
router.post('/:id/delete', authenticate, requireAdmin, eventController.deleteEvent);

module.exports = router;
