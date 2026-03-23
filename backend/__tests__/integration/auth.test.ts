import './setup';
import request from 'supertest';
import app from '../../src/app';
import { mockQuery } from './setup';
import { createMockUser, getAuthHeaders } from '../helpers';
import bcrypt from 'bcrypt';

// ── Helpers ─────────────────────────────────────────────────────────

const NOW = new Date('2025-06-15T10:00:00.000Z');

function userRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'b3d7c8a0-1234-4abc-9def-000000000001',
    name: 'Elena Woodsworth',
    email: 'elena@pyrawood.com',
    role: 'customer',
    avatar_url: null,
    password_hash: bcrypt.hashSync('password123', 1), // low rounds for speed
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  };
}

// ── Tests ───────────────────────────────────────────────────────────

describe('Auth Integration', () => {
  // ── POST /api/auth/register ────────────────────────────────────────

  describe('POST /api/auth/register', () => {
    it('should register a new user and return 201 with token', async () => {
      // findByEmail returns null (no duplicate)
      mockQuery(
        { match: 'SELECT', rows: [] },
        {
          match: 'INSERT INTO users',
          rows: [userRow({ email: 'newcustomer@pyrawood.com', name: 'Marcus Oakley' })],
        }
      );

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Marcus Oakley', email: 'newcustomer@pyrawood.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('newcustomer@pyrawood.com');
      expect(res.body.data.user.name).toBe('Marcus Oakley');
      expect(res.body.data.user).not.toHaveProperty('passwordHash');
    });

    it('should return 409 when email is already registered', async () => {
      // findByEmail returns an existing user
      mockQuery({
        match: 'SELECT',
        rows: [userRow()],
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Duplicate User', email: 'elena@pyrawood.com', password: 'password123' });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/already registered/i);
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incomplete@pyrawood.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Short Pass', email: 'short@pyrawood.com', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── POST /api/auth/login ───────────────────────────────────────────

  describe('POST /api/auth/login', () => {
    it('should login successfully and return 200 with token', async () => {
      const hashed = bcrypt.hashSync('password123', 1);
      mockQuery({
        match: 'SELECT',
        rows: [userRow({ password_hash: hashed })],
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'elena@pyrawood.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('elena@pyrawood.com');
    });

    it('should return 401 for wrong password', async () => {
      const hashed = bcrypt.hashSync('correctpassword', 1);
      mockQuery({
        match: 'SELECT',
        rows: [userRow({ password_hash: hashed })],
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'elena@pyrawood.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/invalid email or password/i);
    });

    it('should return 401 when user does not exist', async () => {
      mockQuery({ match: 'SELECT', rows: [] });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ghost@pyrawood.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/auth/me ───────────────────────────────────────────────

  describe('GET /api/auth/me', () => {
    it('should return the current user profile with valid token', async () => {
      mockQuery({
        match: 'SELECT',
        rows: [userRow()],
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('elena@pyrawood.com');
      expect(res.body.data.name).toBe('Elena Woodsworth');
    });

    it('should return 401 without authorization header', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set({ Authorization: 'Bearer invalid.token.here' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ── PUT /api/auth/profile ──────────────────────────────────────────

  describe('PUT /api/auth/profile', () => {
    it('should update name successfully', async () => {
      // findByEmail for conflict check (returns null — no conflict)
      // Then update returns updated user
      mockQuery(
        { match: /SELECT.*FROM users WHERE email/, rows: [] },
        {
          match: 'UPDATE users',
          rows: [userRow({ name: 'Elena Oak' })],
        }
      );

      const res = await request(app)
        .put('/api/auth/profile')
        .set(getAuthHeaders())
        .send({ name: 'Elena Oak' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Elena Oak');
    });

    it('should return 401 without auth', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .send({ name: 'Unauthorized' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
