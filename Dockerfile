
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy server files
COPY src/server ./src/server
COPY src/models ./src/models
COPY src/config ./src/config
COPY src/services/local ./src/services/local

# Install additional production dependencies for server
RUN npm install express mongoose jsonwebtoken bcryptjs cors dotenv

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S finance-tracker -u 1001

# Change ownership of the app directory
RUN chown -R finance-tracker:nodejs /app
USER finance-tracker

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["node", "src/server/standalone-server.js"]
