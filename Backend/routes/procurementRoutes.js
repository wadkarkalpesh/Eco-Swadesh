const express = require('express');
const router = express.Router();
const {
  createPool,
  joinPool,
  getPools,
  getPoolById,
} = require('../controllers/procurementController');
const { optionalJWT } = require('../middleware/auth');

router.post('/group-pools/create', optionalJWT, createPool);
router.post('/group-pools/:id/join', optionalJWT, joinPool);
router.get('/group-pools', getPools);
router.get('/group-pools/:id', getPoolById);

module.exports = router;
