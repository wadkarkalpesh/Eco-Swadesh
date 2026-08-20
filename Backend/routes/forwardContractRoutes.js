const express = require('express');
const router = express.Router();
const {
  createContract,
  fundEarnestMargin,
  getContractById,
  listContracts,
} = require('../controllers/forwardContractController');
const { optionalJWT } = require('../middleware/auth');

router.post('/create', optionalJWT, createContract);
router.post('/:id/fund-margin', optionalJWT, fundEarnestMargin);
router.get('/:id', getContractById);
router.get('/', listContracts);

module.exports = router;
