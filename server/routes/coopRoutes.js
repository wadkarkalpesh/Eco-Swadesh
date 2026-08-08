const express = require('express');
const router = express.Router();
const { calculateDividends, disburseDividends } = require('../controllers/coopController');
const { optionalJWT } = require('../middleware/auth');

router.post('/dividends/calculate', optionalJWT, calculateDividends);
router.post('/dividends/disburse', optionalJWT, disburseDividends);

module.exports = router;
