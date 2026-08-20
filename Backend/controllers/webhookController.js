/**
 * Enterprise Webhook Subscriptions & DLQ Controller
 * Lead Architect: Enterprise Integration & Security Architect
 */

const erpWebhookService = require('../services/erpWebhookService');
const dlqDispatcher = require('../services/dlqWebhookDispatcher');
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

const getDeadLetterQueue = (req, res) => {
  const messages = dlqDispatcher.getDLQMessages();
  return res.status(200).json({ success: true, count: messages.length, deadLetterQueue: messages });
};

const replayDeadLetter = async (req, res) => {
  const { dlqId } = req.params;
  const { targetEndpoint } = req.body || {};
  const result = await dlqDispatcher.replayMessage(dlqId, targetEndpoint);
  return res.status(200).json(result);
};

const triggerResilientDispatch = async (req, res) => {
  const {
    eventType = 'order.escrow_released',
    payload = { orderId: 'ORD-9901' },
    endpoint = 'https://erp.enterprise.com/hook',
  } = req.body || {};
  const result = await dlqDispatcher.dispatchWithRetry({ eventType, payload, endpoint });
  return res.status(200).json({ success: true, delivery: result });
};

module.exports = {
  registerSubscription,
  getSubscriptions,
  testDispatch,
  getDeadLetterQueue,
  replayDeadLetter,
  triggerResilientDispatch,
};
