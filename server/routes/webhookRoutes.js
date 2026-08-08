const express = require('express');
const router = express.Router();
const {
  registerSubscription,
  getSubscriptions,
  testDispatch,
} = require('../controllers/webhookController');
const { optionalJWT } = require('../middleware/auth');

router.post('/subscribe', optionalJWT, registerSubscription);
router.get('/subscriptions', getSubscriptions);
router.post('/test-dispatch', testDispatch);

module.exports = router;
