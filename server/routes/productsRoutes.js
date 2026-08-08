const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  getCommodityTrends,
} = require('../controllers/productsController');
const { optionalJWT, requireRole } = require('../middleware/auth');

router.get('/', optionalJWT, getProducts);
router.get('/commodity-trends', getCommodityTrends);
router.get('/:id', optionalJWT, getProductById);
router.post('/', optionalJWT, createProduct);

module.exports = router;
