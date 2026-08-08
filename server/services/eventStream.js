/**
 * Server-Sent Events (SSE) Real-Time Stream Engine
 * Lead Architect: Senior Real-Time Infrastructure Lead
 * Provides Live Push for IoT Telemetry, Milestone Updates, and Escrow Transitions
 */

const EventEmitter = require('events');

class EventBus extends EventEmitter {}
const eventBus = new EventBus();

// Increase event listener limit for concurrent connections
eventBus.setMaxListeners(200);

/**
 * Handle SSE Stream Connection
 * GET /v1/events/stream
 */
const streamEvents = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Initial connection handshake
  res.write(`data: ${JSON.stringify({ event: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  // Heartbeat ping every 25 seconds to keep connection alive
  const heartbeatTimer = setInterval(() => {
    res.write(`: heartbeat\n\n`);
  }, 25000);

  // Event handlers
  const onTelemetry = (data) => {
    res.write(`event: telemetry\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const onEscrowLocked = (data) => {
    res.write(`event: escrow_locked\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const onEscrowReleased = (data) => {
    res.write(`event: escrow_released\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const onCertificateApproved = (data) => {
    res.write(`event: certificate_approved\ndata: ${JSON.stringify(data)}\n\n`);
  };

  eventBus.on('iot:telemetry', onTelemetry);
  eventBus.on('escrow:locked', onEscrowLocked);
  eventBus.on('escrow:released', onEscrowReleased);
  eventBus.on('certificate:approved', onCertificateApproved);

  // Clean up when client disconnects
  req.on('close', () => {
    clearInterval(heartbeatTimer);
    eventBus.off('iot:telemetry', onTelemetry);
    eventBus.off('escrow:locked', onEscrowLocked);
    eventBus.off('escrow:released', onEscrowReleased);
    eventBus.off('certificate:approved', onCertificateApproved);
  });
};

module.exports = {
  eventBus,
  streamEvents,
};
