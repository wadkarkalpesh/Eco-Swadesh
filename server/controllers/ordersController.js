/**
 * Orders Controller - Escrow Protection & Multi-Tier Checkout
 * Lead Architect: Senior Financial & E-Commerce Lead
 */

const db = require('../config/db');

/**
 * Create Escrow-Protected Order (Retail or Heavy Freight Bulk Tonnage)
 * POST /v1/orders/escrow
 */
const createEscrowOrder = (req, res) => {
  const {
    items = [],
    logisticsType = 'RETAIL_PARCEL', // 'RETAIL_PARCEL' | 'HEAVY_FREIGHT'
    shippingAddress = 'Default Certified Delivery Address',
    paymentMethod = 'RAZORPAY_ROUTE_ESCROW',
    currency = 'INR',
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'EMPTY_CART',
      message: 'At least one product item is required to initialize an escrow contract.',
    });
  }

  const buyerId = req.user ? req.user.id : 'usr_consumer_01';
  const buyerName = req.user ? req.user.name : 'Eco Swadesh Buyer';

  let subtotal = 0;
  let isAnyBulk = logisticsType === 'HEAVY_FREIGHT';
  let primarySellerId = 'usr_seller_01';
  let primarySellerName = 'Eco Swadesh Certified Collective';

  const processedItems = items.map((item) => {
    const product = db.findById('products', item.productId);
    const isBulk = Boolean(item.isBulk);
    if (isBulk) isAnyBulk = true;

    const unitPrice = isBulk
      ? item.agreedPricePerTon || (product ? product.bulkPricePerTon : 42000)
      : (product ? product.retailPrice : 450);
    const quantity = item.quantity || item.quantityTons || 1;
    const itemTotal = unitPrice * quantity;
    subtotal += itemTotal;

    if (product) {
      primarySellerId = product.sellerId;
      primarySellerName = product.sellerName;
    }

    return {
      productId: item.productId,
      productName: product ? product.name : (item.name || 'Organic Agri Commodity'),
      isBulk,
      quantity,
      unit: isBulk ? 'Ton' : (product ? product.retailUnit : 'Kg'),
      unitPrice,
      total: itemTotal,
      certificationSnapshot: {
        certName: product ? product.certName : 'Jaivik Bharat NPOP Standards',
        certLicense: product ? product.certLicense : 'NPOP/NAB/0014/2025',
        verifiedScore: product ? product.rating * 20 : 98,
        snapshotDate: new Date().toISOString(),
      },
    };
  });

  // Calculate freight and platform escrow fee
  const freightCharges = isAnyBulk ? 4500 : 80;
  const platformFee = Math.round(subtotal * 0.005); // 0.5% platform facilitation fee
  const grandTotal = subtotal + freightCharges + platformFee;

  const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const escrowContractId = `ESC-${Math.floor(1000 + Math.random() * 9000)}`;
  const shipmentId = `SHIP-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = db.insert('orders', {
    id: orderId,
    buyerId,
    buyerName,
    sellerId: primarySellerId,
    sellerName: primarySellerName,
    logisticsType: isAnyBulk ? 'HEAVY_FREIGHT' : 'RETAIL_PARCEL',
    shippingAddress,
    currency,
    items: processedItems,
    subtotal,
    freightCharges,
    platformFee,
    grandTotal,
    escrowContractId,
    escrowStatus: 'HELD_IN_ESCROW_POOL',
    paymentStatus: 'PAID_TO_ESCROW',
    paymentMethod,
    destinationLabInspectionStatus: isAnyBulk ? 'PENDING_ARRIVAL' : 'EXEMPT',
    shipmentId,
    createdAt: new Date().toISOString(),
  });

  // Automatically provision corresponding logistics tracking record
  db.insert('shipments', {
    id: shipmentId,
    orderId,
    type: isAnyBulk ? 'BULK_FREIGHT' : 'RETAIL_PARCEL',
    title: isAnyBulk
      ? `${processedItems[0].quantity} Tons ${processedItems[0].productName} Truckload`
      : `${processedItems.length} Organic Certified Parcel Items`,
    origin: 'Certified Farm Depot, Madhya Pradesh, IN',
    destination: shippingAddress,
    weight: isAnyBulk ? `${processedItems[0].quantity} Tons` : '5.5 Kg',
    carrier: isAnyBulk ? 'EcoFreight Heavy Trucking Direct' : 'GreenParcel Carbon-Neutral Courier',
    status: 'IN_TRANSIT',
    driverName: 'Sardar Gurpreet Singh',
    driverPhone: '+91 98230 11200',
    vehicleNo: 'MH-12-VT-9921',
    estDelivery: 'Within 48 Hours',
    escrowStatus: `₹${grandTotal.toLocaleString()} Held in Escrow (Release after destination inspection)`,
    telemetry: {
      temperatureCelsius: 23.4,
      humidityPct: 56.0,
      cargoMoisturePct: 11.4,
      gpsLatitude: 19.8762,
      gpsLongitude: 75.3433,
      speedKmh: 55,
      lastUpdated: new Date().toISOString(),
    },
    milestones: [
      { label: 'Harvest Loaded at Farm', date: 'Today, 08:00 AM', completed: true, timestamp: new Date().toISOString() },
      { label: 'Weighbridge & Initial Lab Stamp', date: 'Today, 11:30 AM', completed: true, timestamp: new Date().toISOString() },
      { label: 'En-Route on Highway NH-52', date: 'In Progress', completed: true, timestamp: new Date().toISOString() },
      { label: 'Destination Lab Check at Warehouse', date: 'Pending Arrival', completed: false },
      { label: 'Final Escrow Release to Farmer', date: 'Pending Lab Check', completed: false },
    ],
  });

  // Audit log creation of escrow order
  db.logAudit({
    actorId: buyerId,
    actorRole: 'buyer',
    action: 'CREATE_ESCROW_ORDER',
    targetType: 'ORDER',
    targetId: orderId,
    reason: `Created escrow contract ${escrowContractId} for grand total of ₹${grandTotal.toLocaleString()}`,
  });

  return res.status(201).json({
    success: true,
    orderId,
    escrowContractId,
    shipmentId,
    grandTotal,
    escrowStatus: 'HELD_IN_ESCROW_POOL',
    order: newOrder,
    message: 'Order placed successfully. Funds are securely locked in the Eco Swadesh Escrow Pool.',
  });
};

/**
 * List User Orders
 * GET /v1/orders
 */
const getOrders = (req, res) => {
  const userId = req.user ? req.user.id : null;
  let list = db.getAll('orders');

  if (userId) {
    list = list.filter((o) => o.buyerId === userId || o.sellerId === userId);
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

module.exports = {
  createEscrowOrder,
  getOrders,
  getOrderById,
  releaseEscrow,
};
