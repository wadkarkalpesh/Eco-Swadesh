const express = require('express');
const router = express.Router();
const {
  diagnoseLeaf,
  calculateSoilDosage,
  getSoilReports,
} = require('../controllers/aiController');
const { optionalJWT } = require('../middleware/auth');

router.post('/diagnose-leaf', optionalJWT, diagnoseLeaf);
router.post('/soil-calculator', optionalJWT, calculateSoilDosage);
router.get('/soil-reports', optionalJWT, getSoilReports);

module.exports = router;
