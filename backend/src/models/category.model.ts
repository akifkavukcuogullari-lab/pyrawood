import { query } from '../config/database';

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: Date;
}

export interface MappedCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  sortOrder: number;
  createdAt: string;
}

function mapToCategory(row: CategoryRow): MappedCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || undefined,
    imageUrl: row.image_url || undefined,
    parentId: row.parent_id || undefined,
    sortOrder: row.sort_order,
    createdAt: row.created_at.toISOString(),
  };
}

export const CategoryModel = {
  async findAll(): Promise<MappedCategory[]> {
    const { rows } = await query<CategoryRow>(
      'SELECT id, name, slug, description, image_url, parent_id, sort_order, created_at FROM categories ORDER BY sort_order ASC, name ASC'
    );
    return rows.map(mapToCategory);
  },

  async findById(id: string): Promise<MappedCategory | null> {
    const { rows } = await query<CategoryRow>(
      'SELECT id, name, slug, description, image_url, parent_id, sort_order, created_at FROM categories WHERE id = $1',
      [id]
    );
    return rows[0] ? mapToCategory(rows[0]) : null;
  },

  async findBySlug(slug: string): Promise<MappedCategory | null> {
    const { rows } = await query<CategoryRow>(
      'SELECT id, name, slug, description, image_url, parent_id, sort_order, created_at FROM categories WHERE slug = $1',
      [slug]
    );
    return rows[0] ? mapToCategory(rows[0]) : null;
  },

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    sortOrder?: number;
  }): Promise<MappedCategory> {
    const { rows } = await query<CategoryRow>(
      `INSERT INTO categories (name, slug, description, image_url, parent_id, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, slug, description, image_url, parent_id, sort_order, created_at`,
      [
        data.name,
        data.slug,
        data.description || null,
        data.imageUrl || null,
        data.parentId || null,
        data.sortOrder ?? 0,
      ]
    );
    return mapToCategory(rows[0]);
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      imageUrl: string;
      parentId: string;
      sortOrder: number;
    }>
  ): Promise<MappedCategory | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.slug !== undefined) {
      fields.push(`slug = $${paramIndex++}`);
      values.push(data.slug);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.imageUrl !== undefined) {
      fields.push(`image_url = $${paramIndex++}`);
      values.push(data.imageUrl);
    }
    if (data.parentId !== undefined) {
      fields.push(`parent_id = $${paramIndex++}`);
      values.push(data.parentId);
    }
    if (data.sortOrder !== undefined) {
      fields.push(`sort_order = $${paramIndex++}`);
      values.push(data.sortOrder);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const { rows } = await query<CategoryRow>(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, name, slug, description, image_url, parent_id, sort_order, created_at`,
      values
    );
    return rows[0] ? mapToCategory(rows[0]) : null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM categories WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
