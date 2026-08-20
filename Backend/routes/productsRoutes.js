const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCommodityTrends,
} = require('../controllers/productsController');
const { optionalJWT, authenticateJWT } = require('../middleware/auth');

router.get('/', optionalJWT, getProducts);
router.get('/commodity-trends', getCommodityTrends);
router.get('/:id', optionalJWT, getProductById);
router.post('/', optionalJWT, createProduct);
router.put('/:id', authenticateJWT, updateProduct);
router.delete('/:id', authenticateJWT, deleteProduct);

module.exports = router;
