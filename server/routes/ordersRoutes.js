const express = require('express');
const router = express.Router();
const {
  createEscrowOrder,
  getOrders,
  getOrderById,
  releaseEscrow,
} = require('../controllers/ordersController');
const { optionalJWT } = require('../middleware/auth');

router.post('/escrow', optionalJWT, createEscrowOrder);
router.get('/', optionalJWT, getOrders);
router.get('/:id', optionalJWT, getOrderById);
router.post('/:id/release-escrow', optionalJWT, releaseEscrow);

module.exports = router;
