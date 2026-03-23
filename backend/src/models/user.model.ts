import { query } from '../config/database';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserRowWithPassword extends UserRow {
  password_hash: string;
}

export interface MappedUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MappedUserWithPassword extends MappedUser {
  passwordHash: string;
}

function mapToUser(row: UserRow): MappedUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatarUrl: row.avatar_url || undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapToUserWithPassword(row: UserRowWithPassword): MappedUserWithPassword {
  return {
    ...mapToUser(row),
    passwordHash: row.password_hash,
  };
}

export const UserModel = {
  async findById(id: string): Promise<MappedUser | null> {
    const { rows } = await query<UserRow>(
      'SELECT id, name, email, role, avatar_url, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] ? mapToUser(rows[0]) : null;
  },

  async findByEmail(email: string): Promise<MappedUserWithPassword | null> {
    const { rows } = await query<UserRowWithPassword>(
      'SELECT id, name, email, role, avatar_url, password_hash, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );
    return rows[0] ? mapToUserWithPassword(rows[0]) : null;
  },

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<MappedUser> {
    const { rows } = await query<UserRow>(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, avatar_url, created_at, updated_at`,
      [data.name, data.email, data.passwordHash]
    );
    return mapToUser(rows[0]);
  },

  async update(
    id: string,
    data: Partial<{ name: string; email: string; passwordHash: string }>
  ): Promise<MappedUser | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(data.email);
    }
    if (data.passwordHash !== undefined) {
      fields.push(`password_hash = $${paramIndex++}`);
      values.push(data.passwordHash);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await query<UserRow>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, name, email, role, avatar_url, created_at, updated_at`,
      values
    );
    return rows[0] ? mapToUser(rows[0]) : null;
  },
};
