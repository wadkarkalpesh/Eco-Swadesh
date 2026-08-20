const express = require('express');
const router = express.Router();
const {
  getTracking,
  calculateFreightQuote,
  calculateCustomsDuty,
  dispatchTransporter,
} = require('../controllers/logisticsController');
const { optionalJWT } = require('../middleware/auth');

router.get('/tracking/:shipmentId', optionalJWT, getTracking);
router.post('/calculate-freight', optionalJWT, calculateFreightQuote);
router.post('/customs-duty', optionalJWT, calculateCustomsDuty);
router.post('/dispatch', optionalJWT, dispatchTransporter);

module.exports = router;
