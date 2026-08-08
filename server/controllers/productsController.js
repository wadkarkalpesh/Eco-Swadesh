/**
 * Products Controller - Marketplace & Bulk Tonnage Catalog
 * Lead Architect: Senior Financial & E-Commerce Lead
 */

const db = require('../config/db');

/**
 * List & Filter Products (Retail & Bulk Harvest)
 * GET /v1/products
 */
const getProducts = (req, res) => {
  const { category, certifiedType, orderMode, search, page = 1, limit = 50 } = req.query;

  let results = db.getAll('products');

  // 1. Filter by category
  if (category && category !== 'all') {
    results = results.filter((p) => p.category === category);
  }

  // 2. Filter by certification type (NATIONAL, LOCAL_GOV, ALL)
  if (certifiedType && certifiedType !== 'ALL') {
    results = results.filter((p) => p.certifiedType === certifiedType);
  }

  // 3. Filter by order mode (RETAIL vs BULK)
  if (orderMode === 'BULK') {
    results = results.filter((p) => p.bulkAvailable === true);
  }

  // 4. Search query filter
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.sellerName?.toLowerCase().includes(q) ||
        p.certName?.toLowerCase().includes(q)
    );
  }

  const total = results.length;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const paginated = results.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return res.status(200).json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    products: paginated,
  });
};

/**
 * Get Product Detail by ID
 * GET /v1/products/:id
 */
const getProductById = (req, res) => {
  const { id } = req.params;
  const product = db.findById('products', id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'PRODUCT_NOT_FOUND',
      message: `Product with ID '${id}' was not found.`,
    });
  }

  return res.status(200).json({
    success: true,
    product,
  });
};

/**
 * Create New Bio-Input or Bulk Harvest Listing
 * POST /v1/products
 */
const createProduct = (req, res) => {
  const {
    name,
    category = 'fertilizers',
    certifiedType = 'NATIONAL',
    certName,
    certLicense,
    retailPrice,
    retailUnit = 'Kg',
    bulkPricePerTon,
    bulkMinTons = 1,
    description,
    npkRatio,
    usageDose,
    origin = 'India',
    image,
    labPurityRating = '99.5% Pure',
  } = req.body;

  if (!name || (!retailPrice && !bulkPricePerTon)) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'Product name and at least one pricing tier (retailPrice or bulkPricePerTon) are required.',
    });
  }

  const sellerId = req.user ? req.user.id : 'usr_seller_01';
  const sellerName = req.user ? req.user.name : 'Certified Organic Producer';

  const newProduct = db.insert('products', {
    name,
    category,
    sellerId,
    sellerName,
    sellerType: category === 'bulkHarvest' ? 'Organic Farmer Collective' : 'Bio-Input Manufacturer',
    origin,
    rating: 5.0,
    reviewsCount: 1,
    certifiedType,
    certName: certName || 'Jaivik Bharat / NPOP Standard',
    certLicense: certLicense || 'NPOP/NAB/0014/2025',
    labPurityRating,
    image: image || 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80',
    retailPrice: Number(retailPrice) || 0,
    retailUnit,
    retailMinQty: 1,
    bulkAvailable: Boolean(bulkPricePerTon),
    bulkPricePerTon: Number(bulkPricePerTon) || 0,
    bulkMinTons: Number(bulkMinTons) || 1,
    bulkUnit: 'Ton',
    description: description || 'Certified organic harvest listed directly by verified farm producer.',
    npkRatio,
    usageDose,
    inStock: true,
    stockQuantity: 100,
  });

  return res.status(201).json({
    success: true,
    productId: newProduct.id,
    product: newProduct,
    message: 'Product listing published successfully on Eco Swadesh Marketplace.',
  });
};

/**
 * Get Live Commodity Market Trends
 * GET /v1/products/commodity-trends
 */
const getCommodityTrends = (req, res) => {
  const trends = db.getAll('commodityPrices');
  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    trends,
  });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  getCommodityTrends,
};
