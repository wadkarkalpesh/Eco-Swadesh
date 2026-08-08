/**
 * Eco Swadesh Database Engine (Firestore & Document-Store Architecture Compatible)
 * Implements in-memory indexing, CRUD operators, and atomic collections
 * for users, products, orders, escrow pools, logistics, AI diagnoses, and audit logs.
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

class EcoSwadeshDB {
  constructor() {
    this.users = [...SEED_USERS];
    this.certifications = [...SEED_CERTIFICATIONS];
    this.products = [...SEED_PRODUCTS];
    this.commodityPrices = [...SEED_COMMODITY_PRICES];
    this.orders = [...SEED_ORDERS];
    this.shipments = [...SEED_SHIPMENTS];
    this.communityPosts = [...SEED_COMMUNITY_POSTS];
    this.aiDiagnoses = [...SEED_AI_DIAGNOSES];
    this.disputes = [...SEED_DISPUTES];
    this.auditLogs = [...SEED_AUDIT_LOGS];
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
    return record;
  }

  update(collectionName, id, updates) {
    const list = this[collectionName] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    return list[index];
  }

  delete(collectionName, id) {
    const list = this[collectionName] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this[collectionName].splice(index, 1);
    return true;
  }

  // --- Specialized Audit Logging (IEEE 830 FR-11) ---
  logAudit({ actorId, actorRole, action, targetType, targetId, reason }) {
    const auditRecord = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId: actorId || 'system',
      actorRole: actorRole || 'system',
      action,
      targetType,
      targetId,
      reason: reason || 'Audit logged by Eco Swadesh compliance engine',
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(auditRecord);
    return auditRecord;
  }

  // --- Reset to Initial Seed (for Testing) ---
  reset() {
    this.users = [...SEED_USERS];
    this.certifications = [...SEED_CERTIFICATIONS];
    this.products = [...SEED_PRODUCTS];
    this.commodityPrices = [...SEED_COMMODITY_PRICES];
    this.orders = [...SEED_ORDERS];
    this.shipments = [...SEED_SHIPMENTS];
    this.communityPosts = [...SEED_COMMUNITY_POSTS];
    this.aiDiagnoses = [...SEED_AI_DIAGNOSES];
    this.disputes = [...SEED_DISPUTES];
    this.auditLogs = [...SEED_AUDIT_LOGS];
    this.otpSessions.clear();
    this.expertBookings = [];
  }
}

// Global Singleton Instance
const db = new EcoSwadeshDB();

module.exports = db;
