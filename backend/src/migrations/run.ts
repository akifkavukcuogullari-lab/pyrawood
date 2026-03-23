import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';

const MIGRATIONS_DIR = path.join(__dirname);

async function ensureMigrationsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function getExecutedMigrations(): Promise<Set<string>> {
  const { rows } = await pool.query('SELECT name FROM migrations ORDER BY name');
  return new Set(rows.map((r) => r.name));
}

async function getMigrationFiles(): Promise<string[]> {
  const files = fs.readdirSync(MIGRATIONS_DIR);
  return files
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function run(): Promise<void> {
  console.log('[migrations] Starting migration runner...');

  try {
    await ensureMigrationsTable();

    const executed = await getExecutedMigrations();
    const files = await getMigrationFiles();
    const pending = files.filter((f) => !executed.has(f));

    if (pending.length === 0) {
      console.log('[migrations] No pending migrations.');
      return;
    }

    console.log(`[migrations] Found ${pending.length} pending migration(s).`);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const file of pending) {
        console.log(`[migrations] Running migration: ${file}...`);
        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
        await client.query(sql);
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
        console.log(`[migrations] Completed: ${file}`);
      }

      await client.query('COMMIT');
      console.log('[migrations] All migrations executed successfully.');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[migrations] Migration failed, rolled back.');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[migrations] Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
