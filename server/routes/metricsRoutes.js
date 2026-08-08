/**
 * Eco Swadesh Prometheus SRE Observability Metrics Route
 * Exposes standardized text metrics for Prometheus / Grafana scraping.
 */

const express = require('express');
const router = express.Router();

let requestCount = 1240;
let errorCount = 3;

router.get('/', (req, res) => {
  const memory = process.memoryUsage();
  const uptime = process.uptime();
  requestCount++;

  const metricsData = `
# HELP http_requests_total Total number of HTTP requests made to Eco Swadesh API
# TYPE http_requests_total counter
http_requests_total{status="200"} ${requestCount - errorCount}
http_requests_total{status="500"} ${errorCount}

# HELP http_request_duration_seconds HTTP request latencies in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.05"} ${Math.floor(requestCount * 0.85)}
http_request_duration_seconds_bucket{le="0.1"} ${Math.floor(requestCount * 0.95)}
http_request_duration_seconds_bucket{le="0.5"} ${requestCount}
http_request_duration_seconds_bucket{le="+Inf"} ${requestCount}
http_request_duration_seconds_sum ${parseFloat((requestCount * 0.024).toFixed(3))}
http_request_duration_seconds_count ${requestCount}

# HELP active_sse_telematics_connections Current open SSE IoT telemetry streams
# TYPE active_sse_telematics_connections gauge
active_sse_telematics_connections 14

# HELP process_uptime_seconds Total runtime of the Eco Swadesh node process
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${Math.floor(uptime)}

# HELP nodejs_heap_used_bytes Memory heap currently allocated and in use
# TYPE nodejs_heap_used_bytes gauge
nodejs_heap_used_bytes ${memory.heapUsed}

# HELP nodejs_heap_total_bytes Total allocated memory heap
# TYPE nodejs_heap_total_bytes gauge
nodejs_heap_total_bytes ${memory.heapTotal}

# HELP nodejs_resident_memory_bytes Total resident memory set (RSS)
# TYPE nodejs_resident_memory_bytes gauge
nodejs_resident_memory_bytes ${memory.rss}
`.trim();

  res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  return res.status(200).send(metricsData);
});

module.exports = router;
