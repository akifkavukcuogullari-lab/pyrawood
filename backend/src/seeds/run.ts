import dotenv from 'dotenv';
dotenv.config();

import { pool } from '../config/database';
import { seedUsers } from './users.seed';
import { seedCategories } from './categories.seed';
import { seedProducts } from './products.seed';

async function run(): Promise<void> {
  console.log('[seed] Starting seed runner...');
  console.log('[seed] Database:', process.env.DATABASE_URL ? 'configured' : 'NOT CONFIGURED');

  try {
    // Order matters: users first, then categories, then products
    await seedUsers();
    await seedCategories();
    await seedProducts();

    console.log('[seed] All seeds completed successfully.');
  } catch (error) {
    console.error('[seed] Seed failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
