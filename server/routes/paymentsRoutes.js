const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  cancelAndRefundOrder,
  createStripeSession,
} = require('../controllers/paymentsController');
const { optionalJWT, authenticateJWT } = require('../middleware/auth');

router.post('/razorpay/create-order', optionalJWT, createRazorpayOrder);
router.post('/razorpay/verify', optionalJWT, verifyRazorpayPayment);
router.post('/razorpay/webhook', handleRazorpayWebhook);
router.post('/refund', optionalJWT, cancelAndRefundOrder);
router.post('/stripe/create-session', optionalJWT, createStripeSession);

module.exports = router;
