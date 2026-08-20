const express = require('express');
const router = express.Router();
const {
  createEscrowOrder,
  getOrders,
  getOrderById,
  releaseEscrow,
  getOrderMessages,
  sendOrderMessage,
} = require('../controllers/ordersController');
const { optionalJWT, authenticateJWT } = require('../middleware/auth');

router.post('/escrow', optionalJWT, createEscrowOrder);
router.get('/', optionalJWT, getOrders);
router.get('/:id', optionalJWT, getOrderById);
router.post('/:id/release-escrow', optionalJWT, releaseEscrow);
router.get('/:id/messages', authenticateJWT, getOrderMessages);
router.post('/:id/messages', authenticateJWT, sendOrderMessage);

module.exports = router;
