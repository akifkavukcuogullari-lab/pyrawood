import { AuthService } from '../../../src/services/auth.service';
import { UserModel } from '../../../src/models/user.model';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../../src/utils/errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock the UserModel
jest.mock('../../../src/models/user.model');

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockUserRow = {
  id: 'b3d7c8a0-1234-4abc-9def-000000000001',
  name: 'Elena Woodsworth',
  email: 'elena@pyrawood.com',
  role: 'customer' as const,
  avatarUrl: undefined,
  createdAt: '2025-06-15T10:00:00.000Z',
  updatedAt: '2025-06-15T10:00:00.000Z',
};

const mockUserWithPassword = {
  ...mockUserRow,
  passwordHash: '$2b$12$hashedpassword',
};

describe('AuthService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should create user with hashed password and return token', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$12$newhashedpassword');
      (UserModel.create as jest.Mock).mockResolvedValue(mockUserRow);

      const result = await AuthService.register({
        name: 'Elena Woodsworth',
        email: 'elena@pyrawood.com',
        password: 'securePass123',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('securePass123', 12);
      expect(UserModel.create).toHaveBeenCalledWith({
        name: 'Elena Woodsworth',
        email: 'elena@pyrawood.com',
        passwordHash: '$2b$12$newhashedpassword',
      });
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('elena@pyrawood.com');
      expect(result.user.name).toBe('Elena Woodsworth');
      expect(result.user.role).toBe('customer');
    });

    it('should throw ConflictError when email already exists', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(mockUserWithPassword);

      await expect(
        AuthService.register({
          name: 'Another User',
          email: 'elena@pyrawood.com',
          password: 'password123',
        })
      ).rejects.toThrow(ConflictError);

      await expect(
        AuthService.register({
          name: 'Another User',
          email: 'elena@pyrawood.com',
          password: 'password123',
        })
      ).rejects.toThrow('Email already registered');
    });

    it('should return a valid JWT token', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$12$hashed');
      (UserModel.create as jest.Mock).mockResolvedValue(mockUserRow);

      const result = await AuthService.register({
        name: 'Elena Woodsworth',
        email: 'elena@pyrawood.com',
        password: 'password123',
      });

      const decoded = jwt.verify(result.token, 'test-jwt-secret-for-unit-tests') as any;
      expect(decoded.userId).toBe(mockUserRow.id);
      expect(decoded.email).toBe(mockUserRow.email);
      expect(decoded.role).toBe(mockUserRow.role);
    });
  });

  describe('login', () => {
    it('should return AuthResponse with valid credentials', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(mockUserWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await AuthService.login({
        email: 'elena@pyrawood.com',
        password: 'securePass123',
      });

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('elena@pyrawood.com');
    });

    it('should throw UnauthorizedError when user is not found', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login({ email: 'unknown@pyrawood.com', password: 'password' })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for wrong password', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(mockUserWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        AuthService.login({ email: 'elena@pyrawood.com', password: 'wrongpassword' })
      ).rejects.toThrow(UnauthorizedError);

      await expect(
        AuthService.login({ email: 'elena@pyrawood.com', password: 'wrongpassword' })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('getProfile', () => {
    it('should return user data when user exists', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(mockUserRow);

      const result = await AuthService.getProfile(mockUserRow.id);

      expect(result.id).toBe(mockUserRow.id);
      expect(result.email).toBe(mockUserRow.email);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.getProfile('nonexistent-id')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProfile', () => {
    it('should update user name', async () => {
      const updatedUser = { ...mockUserRow, name: 'Elena Wood' };
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (UserModel.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await AuthService.updateProfile(mockUserRow.id, { name: 'Elena Wood' });

      expect(result.name).toBe('Elena Wood');
    });

    it('should throw ConflictError when updating to an email already in use by another user', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUserRow,
        id: 'different-user-id',
      });

      await expect(
        AuthService.updateProfile(mockUserRow.id, { email: 'elena@pyrawood.com' })
      ).rejects.toThrow(ConflictError);
    });

    it('should hash new password when updating', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$12$newhash');
      (UserModel.update as jest.Mock).mockResolvedValue(mockUserRow);

      await AuthService.updateProfile(mockUserRow.id, { password: 'newPassword123' });

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 12);
      expect(UserModel.update).toHaveBeenCalledWith(mockUserRow.id, {
        passwordHash: '$2b$12$newhash',
      });
    });
  });
});
