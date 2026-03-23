import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth';
import { UnauthorizedError } from '../utils/errors';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Authentication middleware — requires a valid Bearer token.
 * Sets req.user with { id, email, role }.
 */
export function auth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError());
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch {
    next(new UnauthorizedError());
  }
}

/**
 * Optional authentication middleware — attaches user if token is present
 * but does not fail if no token is provided.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    // Token invalid — proceed without user
  }

  next();
}
