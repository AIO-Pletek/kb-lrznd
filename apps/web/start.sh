#!/bin/sh
set -e
cd /app

echo "=== Ensuring upload directories ==="
mkdir -p /app/public/uploads/images
mkdir -p /app/public/uploads/documents
mkdir -p /app/public/uploads/videos
mkdir -p /app/public/uploads/others

echo "=== Running DB migration ==="
node lib/db/run-migrate.mjs

echo "=== Starting Next.js ==="
exec node server.js
