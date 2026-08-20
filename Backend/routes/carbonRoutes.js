const express = require('express');
const router = express.Router();
const {
  calculateSequestration,
  mintCredits,
  getCreditById,
  retireCredit,
} = require('../controllers/carbonController');
const { optionalJWT } = require('../middleware/auth');

router.post('/calculate-sequestration', calculateSequestration);
router.post('/mint-credits', optionalJWT, mintCredits);
router.get('/registry/:creditId', getCreditById);
router.post('/retire', optionalJWT, retireCredit);

module.exports = router;
