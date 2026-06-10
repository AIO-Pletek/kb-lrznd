# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S kb && adduser -S nextjs -u 1001 -G kb

COPY --from=builder --chown=nextjs:kb /app/public ./public
COPY --from=builder --chown=nextjs:kb /app/.next/standalone ./
COPY --from=builder --chown=nextjs:kb /app/.next/static ./.next/static

# Copy migration files
COPY --from=builder --chown=nextjs:kb /app/lib/db/migrations ./lib/db/migrations
COPY --from=builder --chown=nextjs:kb /app/lib/db/run-migrate.mjs ./lib/db/run-migrate.mjs

# Copy node_modules for drizzle-orm (standalone doesn't bundle all)
COPY --from=builder --chown=nextjs:kb /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:kb /app/package.json ./package.json

# Create uploads directory
RUN mkdir -p /app/public/uploads && chown -R nextjs:kb /app

# Startup script
RUN cat > /app/start.sh << 'EOF' && chmod +x /app/start.sh && chown nextjs:kb /app/start.sh
#!/bin/sh
set -e
cd /app
echo "=== Running DB migration ==="
node lib/db/run-migrate.mjs
echo "=== Starting Next.js ==="
exec node server.js
EOF

USER nextjs
EXPOSE 3000

CMD ["/app/start.sh"]
