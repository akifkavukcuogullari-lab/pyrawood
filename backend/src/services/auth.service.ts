import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel, MappedUser } from '../models/user.model';
import { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS } from '../config/auth';
import { AppError, NotFoundError, ConflictError, UnauthorizedError } from '../utils/errors';

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    avatarUrl?: string;
  };
  token: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface UpdateProfileRequest {
  name?: string;
  email?: string;
  password?: string;
}

function generateToken(user: MappedUser): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function toAuthResponse(user: MappedUser, token: string): AuthResponse {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
    token,
  };
}

export const AuthService = {
  async register(data: CreateUserRequest): Promise<AuthResponse> {
    const existing = await UserModel.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    const token = generateToken(user);
    return toAuthResponse(user, token);
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken(user);
    return toAuthResponse(user, token);
  },

  async getProfile(userId: string): Promise<MappedUser> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  },

  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<MappedUser> {
    if (data.email) {
      const existing = await UserModel.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        throw new ConflictError('Email already in use');
      }
    }

    const updateData: Partial<{ name: string; email: string; passwordHash: string }> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password !== undefined) {
      updateData.passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    }

    const user = await UserModel.update(userId, updateData);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  },
};
