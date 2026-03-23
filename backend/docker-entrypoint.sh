#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
until node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT 1').then(() => { pool.end(); process.exit(0); }).catch(() => { pool.end(); process.exit(1); });
" 2>/dev/null; do
  echo "  PostgreSQL not ready, retrying in 2s..."
  sleep 2
done
echo "PostgreSQL is ready."

# Run migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running migrations..."
  node dist/migrations/run.js
  echo "Migrations complete."
fi

# Run seeds
if [ "$RUN_SEEDS" = "true" ]; then
  echo "Running seeds..."
  node dist/seeds/run.js
  echo "Seeds complete."
fi

exec "$@"
