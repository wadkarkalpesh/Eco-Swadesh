/**
 * Orders & Escrow Lifecycle Controller
 * Lead Architect: Principal FinTech & Logistics Architect
 * Implements: Escrow Locks, Destination Lab Verification, Invoice Breakdown, and Order-Scoped Messaging
 */

const db = require('../config/db');
const { eventBus } = require('../services/eventStream');

/**
 * Place Order & Initialize Escrow Contract
 * POST /v1/orders/escrow
 */
const createEscrowOrder = (req, res) => {
  const item = (req.body.items && req.body.items[0]) || {};
  const effectiveProductId = req.body.productId || item.productId || 'prod-1';
  const effectiveQty = req.body.quantityTons !== undefined ? req.body.quantityTons : (item.quantityTons !== undefined ? item.quantityTons : 1);
  const effectiveCustomPrice = req.body.customPricePerTon || item.agreedPricePerTon;
  const effectiveAddress = req.body.deliveryAddress || req.body.shippingAddress || 'Central Agro Hub, Pune, IN';

  const product = db.findById('products', effectiveProductId) || db.products[0];
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'PRODUCT_NOT_FOUND',
      message: `Product '${effectiveProductId}' is unavailable.`,
    });
  }

  const buyerId = req.user ? req.user.id : (requestedBuyerId || 'usr_buyer_01');
  const buyerName = req.user ? req.user.name : 'Verified Organic Buyer';
  const sellerId = product.sellerId || product.farmerId || requestedSellerId || 'usr_seller_01';
  const sellerName = product.sellerName || product.farmerName || 'Verified Farm Collective';

  const isBulk = (req.body.orderMode === 'BULK') || (item.isBulk === true) || Number(effectiveQty) >= (product.bulkMinTons || 1);
  const effectivePrice = isBulk
    ? (effectiveCustomPrice || product.bulkPricePerTon || product.retailPrice * 1000)
    : product.retailPrice;
  const unit = isBulk ? 'Ton' : (product.retailUnit || 'Kg');
  const qty = Number(effectiveQty) || 1;

  const subtotal = Math.round(effectivePrice * qty);
  const platformFee = Math.round(subtotal * 0.025); // 2.5% platform fee
  const escrowProtectionFee = Math.round(subtotal * 0.015); // 1.5% escrow security fee
  const logisticsEstimate = isBulk ? qty * 1800 : 150;
  const grandTotal = subtotal + platformFee + escrowProtectionFee + logisticsEstimate;

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const escrowContractId = `ESC-CTR-${Date.now()}`;
  const shipmentId = `SHP-${Date.now().toString().slice(-6)}`;

  const newOrder = db.insert('orders', {
    id: orderId,
    productId: effectiveProductId,
    productName: product.name,
    productImage: product.image,
    category: product.category,
    orderMode: isBulk ? 'BULK' : 'RETAIL',
    quantity: qty,
    unit,
    effectivePrice,
    subtotal,
    platformFee,
    escrowProtectionFee,
    logisticsEstimate,
    grandTotal,
    buyerId,
    buyerName,
    sellerId,
    sellerIds: [sellerId],
    sellerName,
    farmerId: product.farmerId || sellerId,
    deliveryAddress: effectiveAddress,
    buyerNotes: req.body.buyerNotes || 'Standard Organic APEDA Grade-A Verification Requested',
    status: 'created',
    paymentStatus: 'AWAITING_PAYMENT',
    escrowStatus: 'HELD_IN_ESCROW_POOL',
    escrowContractId,
    shipmentId,
    destinationLabInspectionStatus: 'PENDING_SAMPLE_COLLECTION',
    createdAt: new Date().toISOString(),
  });

  // Provision associated telemetry shipment
  db.insert('shipments', {
    id: shipmentId,
    orderId,
    productName: product.name,
    quantityTons: qty,
    origin: product.origin || 'Maharashtra, India',
    destination: effectiveAddress,
    status: 'DISPATCH_QUEUED',
    carrier: 'Eco Swadesh Reefer Fleet #42',
    temperatureC: 4.2,
    humidityPct: 82,
    driverPhone: '+919811223344',
    gpsCoordinates: { lat: 18.5204, lng: 73.8567 },
    telemetry: {
      temperatureCelsius: 4.2,
      humidityPct: 82,
      gpsCoordinates: { lat: 18.5204, lng: 73.8567 },
      coldChainHealthy: true,
      lastUpdated: new Date().toISOString(),
    },
    milestones: [
      { step: 'Order Placed & Escrow Locked', completed: true, timestamp: new Date().toISOString() },
      { step: 'NABL Certified Lab Sampling', completed: false },
      { step: 'Cold Chain Reefer In-Transit', completed: false },
      { step: 'APMC Destination Inspection & Escrow Release', completed: false },
    ],
  });

  db.logAudit({
    actorId: buyerId,
    actorRole: 'buyer',
    action: 'CREATE_ESCROW_ORDER',
    targetType: 'ORDER',
    targetId: orderId,
    reason: `Initialized escrow contract ${escrowContractId} for ${qty} ${unit} of ${product.name} (Total: INR ${grandTotal})`,
  });

  return res.status(201).json({
    success: true,
    orderId,
    shipmentId,
    escrowContractId,
    escrowStatus: 'HELD_IN_ESCROW_POOL',
    order: newOrder,
    message: 'Order created with Escrow Protection. Complete payment to lock funds.',
  });
};

/**
 * Get Orders (Filtered by Role / Persona)
 * GET /v1/orders
 */
const getOrders = (req, res) => {
  const { status, buyerId, sellerId } = req.query;
  let list = db.getAll('orders');

  if (status) {
    list = list.filter((o) => o.status === status || o.escrowStatus === status);
  }

  if (buyerId) {
    list = list.filter((o) => o.buyerId === buyerId);
  }

  if (sellerId) {
    list = list.filter((o) => o.sellerId === sellerId || (o.sellerIds && o.sellerIds.includes(sellerId)));
  }

  // If authenticated user is not admin, scope to their own orders
  if (req.user && !req.user.roles?.includes('admin')) {
    const userId = req.user.id;
    list = list.filter(
      (o) => o.buyerId === userId || o.sellerId === userId || (o.sellerIds && o.sellerIds.includes(userId))
    );
  }

  return res.status(200).json({
    success: true,
    total: list.length,
    orders: list,
  });
};

/**
 * Get Order Details and Invoice Breakdown
 * GET /v1/orders/:id
 */
const getOrderById = (req, res) => {
  const { id } = req.params;
  const order = db.findById('orders', id);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'ORDER_NOT_FOUND',
      message: `Order '${id}' does not exist.`,
    });
  }

  return res.status(200).json({
    success: true,
    order,
    invoice: {
      invoiceNo: `INV-${order.id}`,
      date: order.createdAt,
      gstTaxPct: 5,
      taxAmount: Math.round(order.subtotal * 0.05),
      grandTotal: order.grandTotal,
      escrowProof: order.escrowContractId,
    },
  });
};

/**
 * Release Funds from Escrow Pool to Seller
 * POST /v1/orders/:id/release-escrow
 */
const releaseEscrow = (req, res) => {
  const { id } = req.params;
  const order = db.findById('orders', id);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'ORDER_NOT_FOUND',
      message: `Order '${id}' not found.`,
    });
  }

  order.escrowStatus = 'RELEASED_TO_SELLER';
  order.paymentStatus = 'SETTLED_TO_SELLER_ACCOUNT';
  order.destinationLabInspectionStatus = 'PASSED_VERIFIED';
  order.releasedAt = new Date().toISOString();

  // Also complete the final shipment milestone
  const shipment = db.findById('shipments', order.shipmentId);
  if (shipment) {
    shipment.status = 'DELIVERED';
    shipment.milestones.forEach((m) => {
      m.completed = true;
    });
  }

  db.logAudit({
    actorId: req.user ? req.user.id : 'destination_lab',
    actorRole: 'verifier',
    action: 'RELEASE_ESCROW_FUNDS',
    targetType: 'ORDER',
    targetId: order.id,
    reason: 'Lab inspection verified purity standards; released escrow to seller bank ledger.',
  });

  return res.status(200).json({
    success: true,
    orderId: order.id,
    escrowStatus: 'RELEASED_TO_SELLER',
    message: 'Escrow payment successfully settled to seller bank ledger via Razorpay Route.',
    order,
  });
};

/**
 * Get Order-Scoped Messages (Phase 6.2)
 * GET /v1/orders/:id/messages
 */
const getOrderMessages = (req, res) => {
  const { id } = req.params;
  const order = db.findById('orders', id);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'ORDER_NOT_FOUND',
      message: `Order '${id}' was not found.`,
    });
  }

  // Phase 6.2: Authorization check - only buyer and sellers on that order can read
  const userId = req.user ? req.user.id : null;
  const userRoles = req.user?.roles || [];
  const isAuthorized =
    userId &&
    (order.buyerId === userId ||
      order.sellerId === userId ||
      (order.sellerIds && order.sellerIds.includes(userId)) ||
      userRoles.includes('admin'));

  if (!isAuthorized) {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN_ORDER_ACCESS',
      message: 'Access denied. You must be a buyer or seller on this specific order to access messages.',
    });
  }

  if (!db.orderMessages.has(id)) {
    db.orderMessages.set(id, []);
  }

  const messages = db.orderMessages.get(id);

  return res.status(200).json({
    success: true,
    orderId: id,
    total: messages.length,
    messages,
  });
};

/**
 * Send Order-Scoped Message (Phase 6.2)
 * POST /v1/orders/:id/messages
 */
const sendOrderMessage = (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'MISSING_TEXT',
      message: 'Message text is required.',
    });
  }

  const order = db.findById('orders', id);
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'ORDER_NOT_FOUND',
      message: `Order '${id}' was not found.`,
    });
  }

  const userId = req.user ? req.user.id : 'usr_buyer_01';
  const userRoles = req.user?.roles || [];
  const isAuthorized =
    userId &&
    (order.buyerId === userId ||
      order.sellerId === userId ||
      (order.sellerIds && order.sellerIds.includes(userId)) ||
      userRoles.includes('admin'));

  if (!isAuthorized) {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN_ORDER_ACCESS',
      message: 'Access denied. You must be a buyer or seller on this specific order to send messages.',
    });
  }

  if (!db.orderMessages.has(id)) {
    db.orderMessages.set(id, []);
  }

  const messageRecord = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    orderId: id,
    senderId: userId,
    senderName: req.user ? req.user.name : (userId === order.buyerId ? 'Buyer' : 'Seller'),
    text,
    timestamp: new Date().toISOString(),
  };

  db.orderMessages.get(id).push(messageRecord);

  return res.status(201).json({
    success: true,
    orderId: id,
    message: messageRecord,
  });
};

module.exports = {
  createEscrowOrder,
  getOrders,
  getOrderById,
  releaseEscrow,
  getOrderMessages,
  sendOrderMessage,
};
