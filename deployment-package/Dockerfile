
# Multi-stage build for Finance Tracker
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY src/ ./src/
COPY healthcheck.js ./

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/healthcheck.js ./
COPY --from=builder /app/package*.json ./

# Create logs directory
RUN mkdir -p logs

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S finance-tracker -u 1001 -G nodejs

# Change ownership
RUN chown -R finance-tracker:nodejs /app

# Switch to non-root user
USER finance-tracker

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["node", "src/server/standalone-server.js"]
