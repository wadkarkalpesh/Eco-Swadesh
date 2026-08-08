const express = require('express');
const router = express.Router();
const {
  registerSubscription,
  getSubscriptions,
  testDispatch,
  getDeadLetterQueue,
  replayDeadLetter,
  triggerResilientDispatch,
} = require('../controllers/webhookController');
const { optionalJWT } = require('../middleware/auth');

router.post('/subscribe', optionalJWT, registerSubscription);
router.get('/subscriptions', getSubscriptions);
router.post('/test-dispatch', testDispatch);
router.get('/dlq', getDeadLetterQueue);
router.post('/dlq/:dlqId/replay', replayDeadLetter);
router.post('/dispatch-resilient', triggerResilientDispatch);

module.exports = router;
