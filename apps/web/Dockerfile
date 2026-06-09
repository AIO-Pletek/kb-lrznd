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

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy migration files
COPY --from=builder /app/lib/db/migrations ./lib/db/migrations
COPY --from=builder /app/lib/db/run-migrate.mjs ./lib/db/run-migrate.mjs

# Copy node_modules for drizzle-orm (standalone doesn't bundle all)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create uploads directory
RUN mkdir -p /app/public/uploads && chown nextjs:kb /app/public/uploads

# Startup script
RUN echo -e '#!/bin/sh\ncd /app\nnode lib/db/run-migrate.mjs\nnode server.js' > /app/start.sh && chmod +x /app/start.sh

USER nextjs
EXPOSE 3000

CMD ["/app/start.sh"]
