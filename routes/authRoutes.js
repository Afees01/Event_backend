const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// admin login
router.post('/admin/login', authController.adminLogin);

// user signup/login
router.post('/signup', authController.userSignup);
router.post('/login', authController.userLogin);

module.exports = router;
