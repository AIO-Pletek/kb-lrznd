#!/bin/sh
set -e
cd /app
echo "=== Running DB migration ==="
node lib/db/run-migrate.mjs
echo "=== Starting Next.js ==="
exec node server.js
