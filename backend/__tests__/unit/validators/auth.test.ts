import { registerSchema, loginSchema, updateProfileSchema } from '../../../src/validators/auth.validator';

describe('registerSchema', () => {
  it('should accept valid registration data', () => {
    const result = registerSchema.safeParse({
      name: 'Elena Woodsworth',
      email: 'elena@pyrawood.com',
      password: 'securePass123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject an invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'Elena Woodsworth',
      email: 'not-an-email',
      password: 'securePass123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('should reject a password shorter than 6 characters', () => {
    const result = registerSchema.safeParse({
      name: 'Elena',
      email: 'elena@pyrawood.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('password');
    }
  });

  it('should reject a name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({
      name: 'E',
      email: 'elena@pyrawood.com',
      password: 'securePass123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name');
    }
  });

  it('should reject missing fields', () => {
    const result = registerSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('should accept valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'elena@pyrawood.com',
      password: 'securePass123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'bad-email',
      password: 'securePass123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const result = loginSchema.safeParse({
      email: 'elena@pyrawood.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const result = loginSchema.safeParse({ password: 'test123' });
    expect(result.success).toBe(false);
  });
});

describe('updateProfileSchema', () => {
  it('should accept partial updates', () => {
    const result = updateProfileSchema.safeParse({ name: 'Updated Name' });
    expect(result.success).toBe(true);
  });

  it('should accept empty object (no updates)', () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should reject invalid optional email', () => {
    const result = updateProfileSchema.safeParse({ email: 'not-email' });
    expect(result.success).toBe(false);
  });
});
