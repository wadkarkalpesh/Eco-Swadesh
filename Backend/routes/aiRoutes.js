const express = require('express');
const router = express.Router();
const {
  diagnoseLeaf,
  diagnosePhoto,
  escalateToExpert,
  calculateSoilDosage,
  getSoilReports,
} = require('../controllers/aiController');
const { optionalJWT, authenticateJWT } = require('../middleware/auth');

router.post('/diagnose-leaf', optionalJWT, diagnoseLeaf);
router.post('/diagnose-photo', optionalJWT, diagnosePhoto);
router.post('/escalate-to-expert', optionalJWT, escalateToExpert);
router.post('/soil-calculator', optionalJWT, calculateSoilDosage);
router.get('/soil-reports', optionalJWT, getSoilReports);

module.exports = router;
