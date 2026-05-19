const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// مسارات نظام التسجيل
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/complete-profile', authController.completeProfile);

module.exports = router;

