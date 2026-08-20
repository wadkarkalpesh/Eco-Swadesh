const express = require('express');
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  registerUser,
  loginUser,
  logoutUser,
  addRole,
  getMe,
  switchPersona,
  updateProfile,
  exportPersonalData,
} = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');

router.post('/send-otp', authRateLimiter, sendOTP);
router.post('/verify-otp', authRateLimiter, verifyOTP);
router.post('/register', authRateLimiter, registerUser);
router.post('/login', authRateLimiter, loginUser);
router.post('/logout', logoutUser);
router.post('/roles', authenticateJWT, addRole);
router.post('/add-role', authenticateJWT, addRole);
router.get('/me', authenticateJWT, getMe);
router.put('/switch-persona', authenticateJWT, switchPersona);
router.put('/profile', authenticateJWT, updateProfile);
router.get('/data-export', authenticateJWT, exportPersonalData);

module.exports = router;
