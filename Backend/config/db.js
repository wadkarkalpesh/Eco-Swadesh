/**
 * Deccan Origin Database Engine (Supabase & PostgreSQL Architecture Compatible)
 * Implements in-memory indexing, CRUD operators, and atomic collections
 * for users, products, listings, orders, escrow pools, logistics, AI diagnoses, and audit logs.
 */

const {
  SEED_USERS,
  SEED_CERTIFICATIONS,
  SEED_PRODUCTS,
  SEED_COMMODITY_PRICES,
  SEED_ORDERS,
  SEED_SHIPMENTS,
  SEED_COMMUNITY_POSTS,
  SEED_AI_DIAGNOSES,
  SEED_DISPUTES,
  SEED_AUDIT_LOGS,
} = require('./seedData');

const DEFAULT_PLATFORM_CONFIG = [
  {
    id: 'regions',
    supportedRegions: ['Maharashtra', 'Punjab', 'Karnataka', 'Madhya Pradesh', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh', 'Rajasthan'],
    defaultRegion: 'Maharashtra',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'languages',
    supportedLanguages: [
      { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
      { code: 'mr', name: 'Marathi', native: 'मराठी' },
      { code: 'en', name: 'English', native: 'English' },
      { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
      { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
      { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    ],
    defaultLanguage: 'hi',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'commission',
    retailCommissionPct: 2.5,
    bulkCommissionPct: 1.5,
    escrowHoldingDays: 7,
    currency: 'INR',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

class DeccanOriginDB {
  constructor() {
    this.users = [...SEED_USERS];
    this.certifications = [...SEED_CERTIFICATIONS];
    this.products = [...SEED_PRODUCTS];
    this.listings = [...SEED_PRODUCTS]; // Dual alias for marketplace listings
    this.commodityPrices = [...SEED_COMMODITY_PRICES];
    this.orders = [...SEED_ORDERS];
    this.shipments = [...SEED_SHIPMENTS];
    this.communityPosts = [...SEED_COMMUNITY_POSTS];
    this.aiDiagnoses = [...SEED_AI_DIAGNOSES];
    this.disputes = [...SEED_DISPUTES];
    this.auditLogs = [...SEED_AUDIT_LOGS];
    this.platformConfig = JSON.parse(JSON.stringify(DEFAULT_PLATFORM_CONFIG));
    this.consentRecords = [];
    this.payments = [];
    this.notifications = new Map(); // producerId -> items array
    this.orderMessages = new Map(); // orderId -> messages array
    this.contentFlags = new Map();  // path -> set of userIds
    this.otpSessions = new Map();
    this.expertBookings = [];
  }

  // --- Generic Helpers ---
  getAll(collectionName) {
    return this[collectionName] || [];
  }

  findById(collectionName, id) {
    const list = this[collectionName] || [];
    return list.find((item) => item.id === id);
  }

  filter(collectionName, predicate) {
    const list = this[collectionName] || [];
    return list.filter(predicate);
  }

  insert(collectionName, item) {
    if (!this[collectionName]) {
      this[collectionName] = [];
    }
    const record = {
      id: item.id || `${collectionName.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      ...item,
    };
    this[collectionName].unshift(record);

    // Keep listings in sync if inserting into products
    if (collectionName === 'products' && this.listings) {
      const existsInListings = this.listings.some((l) => l.id === record.id);
      if (!existsInListings) {
        this.listings.unshift(record);
      }
    }
    return record;
  }

  update(collectionName, id, updates) {
    const list = this[collectionName] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };

    // Sync listings <-> products
    if (collectionName === 'products' && this.listings) {
      const lIdx = this.listings.findIndex((l) => l.id === id);
      if (lIdx !== -1) {
        this.listings[lIdx] = { ...this.listings[lIdx], ...updates, updatedAt: new Date().toISOString() };
      }
    } else if (collectionName === 'listings' && this.products) {
      const pIdx = this.products.findIndex((p) => p.id === id);
      if (pIdx !== -1) {
        this.products[pIdx] = { ...this.products[pIdx], ...updates, updatedAt: new Date().toISOString() };
      }
    }

    return list[index];
  }

  delete(collectionName, id) {
    const list = this[collectionName] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this[collectionName].splice(index, 1);
    return true;
  }

  // --- Specialized Audit Logging (IEEE 830 FR-11 & Implementation Guide Phase 4/8) ---
  logAudit({ actorId, actorRole, action, targetType, targetId, reason }) {
    const auditRecord = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId: actorId || 'system',
      actorRole: actorRole || 'system',
      action,
      targetType,
      targetId,
      reason: reason || 'Audit logged by Deccan Origin compliance engine',
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(auditRecord);
    return auditRecord;
  }

  // --- DPDP Consent Logging (Phase 9.3) ---
  recordConsent({ userId, phoneNumber, email, consentType = 'SIGNUP_TERMS_DPDP_2023', ipAddress }) {
    const record = {
      id: `dpdp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      phoneNumber,
      email,
      consentType,
      consentGranted: true,
      timestamp: new Date().toISOString(),
      ipAddress: ipAddress || '127.0.0.1',
      legalFramework: 'Digital Personal Data Protection Act (DPDP), 2023',
    };
    this.consentRecords.unshift(record);
    return record;
  }

  // --- Notifications Helper (Phase 4.4) ---
  addNotification(userId, notification) {
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    const item = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    this.notifications.get(userId).unshift(item);
    return item;
  }

  getNotifications(userId) {
    return this.notifications.get(userId) || [];
  }

  // --- Reset to Initial Seed (for Testing) ---
  reset() {
    this.users = [...SEED_USERS];
    this.certifications = [...SEED_CERTIFICATIONS];
    this.products = [...SEED_PRODUCTS];
    this.listings = [...SEED_PRODUCTS];
    this.commodityPrices = [...SEED_COMMODITY_PRICES];
    this.orders = [...SEED_ORDERS];
    this.shipments = [...SEED_SHIPMENTS];
    this.communityPosts = [...SEED_COMMUNITY_POSTS];
    this.aiDiagnoses = [...SEED_AI_DIAGNOSES];
    this.disputes = [...SEED_DISPUTES];
    this.auditLogs = [...SEED_AUDIT_LOGS];
    this.platformConfig = JSON.parse(JSON.stringify(DEFAULT_PLATFORM_CONFIG));
    this.consentRecords = [];
    this.payments = [];
    this.notifications.clear();
    this.orderMessages.clear();
    this.contentFlags.clear();
    this.otpSessions.clear();
    this.expertBookings = [];
  }
}

// Global Singleton Instance
const db = new DeccanOriginDB();

module.exports = db;
