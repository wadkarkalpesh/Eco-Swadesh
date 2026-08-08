const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, getMe, switchPersona } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/auth');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', authenticateJWT, getMe);
router.put('/switch-persona', authenticateJWT, switchPersona);

module.exports = router;
