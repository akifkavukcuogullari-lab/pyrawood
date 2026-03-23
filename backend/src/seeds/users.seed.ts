import bcrypt from 'bcrypt';
import { pool } from '../config/database';
import { BCRYPT_ROUNDS } from '../config/auth';

export async function seedUsers(): Promise<void> {
  console.log('[seed] Seeding users...');

  const users = [
    { name: 'Admin', email: 'admin@pyrawood.com', password: 'admin123', role: 'admin' },
    { name: 'Jane Customer', email: 'customer@example.com', password: 'customer123', role: 'customer' },
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [user.name, user.email, passwordHash, user.role]
    );
    console.log(`[seed]   User: ${user.email} (${user.role})`);
  }

  console.log('[seed] Users seeded.');
}
