const express = require('express');
const router = express.Router();
const { evaluateShelfLife } = require('../controllers/shelfLifeController');

router.post('/evaluate', evaluateShelfLife);

module.exports = router;
