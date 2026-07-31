# ==============================================================================
# MULTI-STAGE DOCKERFILE FOR IBEN STUDIO (ENTERPRISE BACKEND + STATIC FRONTEND)
# ==============================================================================

# ------------------------------------------------------------------------------
# STAGE 1: DEPENDENCY RESOLUTION & BUILD
# ------------------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY server/package*.json ./server/

# Install exact dependencies
WORKDIR /app/server
RUN npm ci

# Copy server code and build/test artifacts
COPY server/ ./
COPY . /app/public/

# Run security audit & test check (optional during container build)
RUN npm test --if-present

# ------------------------------------------------------------------------------
# STAGE 2: PRODUCTION RUNTIME IMAGE
# ------------------------------------------------------------------------------
FROM node:20-alpine AS production

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/data/iben-studio.sqlite
ENV PUBLIC_DIR=/app/public

# Add non-root system user for security compliance
RUN addgroup -S ibengroup && adduser -S ibenuser -G ibengroup
RUN mkdir -p /data && chown -R ibenuser:ibengroup /data

WORKDIR /app

# Copy production dependencies and application code from build stage
COPY --from=build --chown=ibenuser:ibengroup /app/server ./server
COPY --from=build --chown=ibenuser:ibengroup /app/public ./public

WORKDIR /app/server
RUN npm ci --only=production

# Switch to non-root user
USER ibenuser

# Expose HTTP API & Frontend Port
EXPOSE 3000

# Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

# Start the enterprise server
CMD ["node", "src/server.js"]
