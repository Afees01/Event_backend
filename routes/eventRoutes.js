const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});
const upload = multer({ storage });

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
<<<<<<< HEAD
 * /api/events/create:
=======
 * /api/events:
>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78
 *   post:
 *     summary: Create an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
<<<<<<< HEAD
 *         multipart/form-data:
=======
 *         application/json:
>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78
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
<<<<<<< HEAD
 *               image:
 *                 type: string
 *                 format: binary
=======
>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78
 *     responses:
 *       201:
 *         description: Event created
 */
<<<<<<< HEAD
//router.post('/', authenticate, requireAdmin, upload.single('image'), eventController.createEvent);
router.post('/create', authenticate, requireAdmin, upload.single('image'), eventController.createEvent);
=======
router.post('/', authenticate, requireAdmin, eventController.createEvent);

>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78
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
<<<<<<< HEAD
 *         multipart/form-data:
=======
 *         application/json:
>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78
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
<<<<<<< HEAD
 *               image:
 *                 type: string
 *                 format: binary
=======
>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78
 *     responses:
 *       200:
 *         description: Event updated
 *       404:
 *         description: Not found
 */
<<<<<<< HEAD
router.post('/:id/update', authenticate, requireAdmin, upload.single('image'), eventController.updateEvent);
=======
router.post('/:id/update', authenticate, requireAdmin, eventController.updateEvent);
>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78

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
