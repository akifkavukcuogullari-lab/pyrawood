FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies (production only)
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Build TypeScript
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production image
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy compiled JS
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
# Copy SQL migration files (needed at runtime by the migration runner)
COPY src/migrations/*.sql ./dist/migrations/
# Entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
# Uploads directory
RUN mkdir -p uploads && chown expressjs:nodejs uploads

USER expressjs
EXPOSE 3001

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
