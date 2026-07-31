# ==============================================================================
# IBEN STUDIO — ENTERPRISE BACKEND DOCKERFILE
# ==============================================================================
# Optimized multi-stage build for Node.js 20 LTS.
# Supports Render.com, Google Cloud Run, Railway, AWS ECS, & Fly.io.
# ==============================================================================

FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies cleanly
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose server port
EXPOSE 10000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000
ENV ALLOWED_ORIGINS=*

# Launch Enterprise Express Engine
CMD [ "node", "src/server.js" ]
