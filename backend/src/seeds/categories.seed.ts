import { pool } from '../config/database';

const PYRA_WOOD_CATEGORIES = [
  { name: 'Living Room', slug: 'living-room', description: 'Handcrafted sofas, coffee tables, and TV stands' },
  { name: 'Dining', slug: 'dining', description: 'Solid wood dining tables, chairs, and benches' },
  { name: 'Bedroom', slug: 'bedroom', description: 'Premium beds, nightstands, and dressers' },
  { name: 'Office', slug: 'office', description: 'Artisan desks and bookshelves for your workspace' },
  { name: 'Outdoor', slug: 'outdoor', description: 'Weather-resistant garden furniture' },
  { name: 'Decor', slug: 'decor', description: 'Mirrors, wall shelves, and coat racks' },
] as const;

export async function seedCategories(): Promise<void> {
  console.log('[seed] Seeding categories...');

  for (let i = 0; i < PYRA_WOOD_CATEGORIES.length; i++) {
    const cat = PYRA_WOOD_CATEGORIES[i];
    await pool.query(
      `INSERT INTO categories (name, slug, description, sort_order)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO NOTHING`,
      [cat.name, cat.slug, cat.description, i]
    );
    console.log(`[seed]   Category: ${cat.name} (${cat.slug})`);
  }

  console.log('[seed] Categories seeded.');
}
