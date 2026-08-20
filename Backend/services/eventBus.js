/**
 * Bi-Directional SSE Real-Time Event Bus & Channel Multiplexer
 * Lead Architect: Senior Real-Time Streams Engineer
 * Implements: Topic-based Pub/Sub, Channel Filtering, Keepalive Heartbeats, and Client Subscriptions
 */

const { EventEmitter } = require('events');

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.subscribers = new Map(); // channelName -> Set of response objects
    this.totalEventsPublished = 0;
  }

  /**
   * Subscribe an Express Response stream to a specific topic channel
   */
  subscribe(channelName, res) {
    if (!this.subscribers.has(channelName)) {
      this.subscribers.set(channelName, new Set());
    }
    const channelSet = this.subscribers.get(channelName);
    channelSet.add(res);

    // Initial greeting event
    res.write(`event: subscribe_ack\ndata: ${JSON.stringify({ channel: channelName, status: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

    // Clean up when client disconnects
    res.on('close', () => {
      channelSet.delete(res);
      if (channelSet.size === 0) {
        this.subscribers.delete(channelName);
      }
    });
  }

  /**
   * Publish an event to all subscribers of a specific channel
   */
  publish(channelName, eventType, data) {
    this.totalEventsPublished++;
    const payload = {
      channel: channelName,
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
    };

    // Emit internally
    this.emit(`${channelName}:${eventType}`, payload);
    this.emit('event', payload);

    // Push to connected SSE clients
    const channelSet = this.subscribers.get(channelName);
    if (channelSet && channelSet.size > 0) {
      const sseMessage = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
      for (const clientRes of channelSet) {
        try {
          clientRes.write(sseMessage);
        } catch (err) {
          channelSet.delete(clientRes);
        }
      }
    }

    return {
      success: true,
      channel: channelName,
      deliveredToClients: channelSet ? channelSet.size : 0,
      totalEventsPublished: this.totalEventsPublished,
    };
  }

  /**
   * Send heartbeat keepalive across all active channels
   */
  broadcastHeartbeat() {
    const sseHeartbeat = `:keepalive ${new Date().toISOString()}\n\n`;
    for (const channelSet of this.subscribers.values()) {
      for (const clientRes of channelSet) {
        try {
          clientRes.write(sseHeartbeat);
        } catch (e) {
          channelSet.delete(clientRes);
        }
      }
    }
  }

  /**
   * Get active connection stats
   */
  getStats() {
    const channels = {};
    let totalClients = 0;
    for (const [ch, set] of this.subscribers.entries()) {
      channels[ch] = set.size;
      totalClients += set.size;
    }
    return {
      activeChannels: Object.keys(channels).length,
      totalConnectedClients: totalClients,
      channels,
      totalEventsPublished: this.totalEventsPublished,
    };
  }
}

const eventBusInstance = new EventBus();

module.exports = eventBusInstance;
