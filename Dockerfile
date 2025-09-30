# Multi-stage build for production
FROM node:18-alpine AS builder

# Install Python, build tools and OpenSSL for native modules and Prisma
RUN apk add --no-cache python3 make g++ py3-pip openssl-dev openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install Python, build tools and OpenSSL (needed for runtime)
RUN apk add --no-cache python3 make g++ openssl-dev openssl

# Install PM2 globally
RUN npm install -g pm2

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy package files first
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application and other files
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --chown=nestjs:nodejs ecosystem.config.js ./

# Create logs directory
RUN mkdir -p logs && chown -R nestjs:nodejs logs

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3010/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]