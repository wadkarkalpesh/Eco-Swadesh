const express = require('express');
const router = express.Router();
const { scanSample, getSampleCustody } = require('../controllers/labTrackingController');
const { optionalJWT } = require('../middleware/auth');

router.post('/custody-tracking/scan', optionalJWT, scanSample);
router.get('/custody-tracking/:sampleCode', getSampleCustody);

module.exports = router;
