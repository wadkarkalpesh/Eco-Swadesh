/**
 * Enterprise Webhook Subscriptions Controller
 * Lead Architect: Enterprise Integration & Security Architect
 */

const erpWebhookService = require('../services/erpWebhookService');
const db = require('../config/db');

const registerSubscription = (req, res) => {
  const { enterpriseName, targetUrl, events, signingSecret } = req.body;

  if (!enterpriseName || !targetUrl) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'Both enterpriseName and targetUrl are required to register an ERP webhook.',
    });
  }

  const subscription = erpWebhookService.subscribe({
    enterpriseName,
    targetUrl,
    events,
    signingSecret,
  });

  db.logAudit({
    actorId: req.user ? req.user.id : 'erp_admin',
    actorRole: 'integration_architect',
    action: 'REGISTER_ENTERPRISE_WEBHOOK',
    targetType: 'WEBHOOK_SUBSCRIPTION',
    targetId: subscription.id,
    reason: `Registered outbound webhook for ${enterpriseName} targeting ${targetUrl}`,
  });

  return res.status(201).json({
    success: true,
    subscription,
    message: 'Enterprise ERP webhook registered and HMAC signature secret generated.',
  });
};

const getSubscriptions = (req, res) => {
  const subscriptions = erpWebhookService.getSubscriptions();
  return res.status(200).json({ success: true, subscriptions });
};

const testDispatch = (req, res) => {
  const { event = 'order.created', payload = { orderId: 'ORD-TEST-101', total: 420000 } } = req.body;
  const dispatches = erpWebhookService.broadcastEvent(event, payload);
  return res.status(200).json({
    success: true,
    dispatchedCount: dispatches.length,
    dispatches,
    message: `Broadcast event '${event}' dispatched with HMAC signatures.`,
  });
};

module.exports = {
  registerSubscription,
  getSubscriptions,
  testDispatch,
};
