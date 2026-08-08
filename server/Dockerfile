# =====================================================================
# Eco Swadesh Production Backend Containerfile
# Multi-stage lightweight Node.js 20 Alpine distribution
# =====================================================================

FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Security: Run as non-root user
USER node

# Copy production artifacts
COPY --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node . .

EXPOSE 5000

# Automated Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/v1/health || exit 1

CMD ["node", "server.js"]
