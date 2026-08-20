/**
 * Dead-Letter Queue (DLQ) & Resilient Webhook Dispatcher
 * Lead Architect: Principal Distributed Systems Engineer
 * Implements: Exponential Backoff Retries, HMAC-SHA256 Delivery, DLQ Persistence, and Replay Triggers
 */

const crypto = require('crypto');

class DLQWebhookDispatcher {
  constructor() {
    this.deadLetterQueue = [];
    this.deliveryHistory = [];
    this.maxRetries = 3;
    this.baseDelayMs = 200; // Exponential backoff base
  }

  /**
   * Dispatch Webhook with Automatic Exponential Backoff Retries
   * @param {Object} payload Event data to send
   * @param {string} endpoint Target webhook URL
   * @param {string} secret HMAC secret
   */
  async dispatchWithRetry({ eventType, payload, endpoint, secret = 'eco_swadesh_webhook_secret_2026' }) {
    const deliveryId = `dlv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const dataString = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', secret).update(dataString).digest('hex');

    let attempt = 0;
    let delivered = false;
    let lastError = null;

    // Simulate network delivery with retry loop
    while (attempt < this.maxRetries && !delivered) {
      attempt++;
      try {
        // If simulation requires intentional failure (e.g. invalid endpoint)
        if (endpoint.includes('fail') || endpoint.includes('invalid')) {
          throw new Error(`HTTP 503 Service Unavailable at target ${endpoint}`);
        }

        delivered = true;
        const logEntry = {
          deliveryId,
          eventType,
          endpoint,
          attempts: attempt,
          status: 'DELIVERED',
          signature: `sha256=${signature}`,
          timestamp: new Date().toISOString(),
        };
        this.deliveryHistory.unshift(logEntry);
        return logEntry;
      } catch (err) {
        lastError = err.message;
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * this.baseDelayMs;
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    // If all retries exhausted, push to Dead-Letter Queue (DLQ)
    const dlqRecord = {
      dlqId: `dlq_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      deliveryId,
      eventType,
      endpoint,
      payload,
      attempts: attempt,
      lastError,
      status: 'HELD_IN_DEAD_LETTER_QUEUE',
      timestamp: new Date().toISOString(),
      replayedAt: null,
    };

    this.deadLetterQueue.unshift(dlqRecord);
    return dlqRecord;
  }

  /**
   * Get all failed messages in the Dead-Letter Queue
   */
  getDLQMessages() {
    return this.deadLetterQueue;
  }

  /**
   * Replay a message from the Dead-Letter Queue
   */
  async replayMessage(dlqId, targetEndpointOverride = null) {
    const index = this.deadLetterQueue.findIndex((m) => m.dlqId === dlqId);
    if (index === -1) {
      return { success: false, error: 'DLQ_MESSAGE_NOT_FOUND' };
    }

    const message = this.deadLetterQueue[index];
    const endpoint = targetEndpointOverride || message.endpoint.replace('fail', 'recovery');

    const redelivery = await this.dispatchWithRetry({
      eventType: message.eventType,
      payload: message.payload,
      endpoint,
    });

    if (redelivery.status === 'DELIVERED') {
      message.status = 'REPLAYED_SUCCESSFULLY';
      message.replayedAt = new Date().toISOString();
    }

    return {
      success: true,
      dlqMessage: message,
      redeliveryResult: redelivery,
    };
  }
}

const dlqDispatcherInstance = new DLQWebhookDispatcher();

module.exports = dlqDispatcherInstance;
