import { auth, optionalAuth } from '../../../src/middleware/auth';
import { createMockRequest, createMockResponse, createMockNext, generateTestToken } from '../../helpers';
import { UnauthorizedError } from '../../../src/utils/errors';
import { Request, Response, NextFunction } from 'express';

describe('auth middleware', () => {
  it('should call next with UnauthorizedError when no Authorization header', () => {
    const req = createMockRequest({ headers: {} }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    auth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should call next with UnauthorizedError when Authorization header is not Bearer', () => {
    const req = createMockRequest({ headers: { authorization: 'Basic abc123' } }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    auth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should call next with UnauthorizedError when token is invalid', () => {
    const req = createMockRequest({ headers: { authorization: 'Bearer invalid-token' } }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    auth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should set req.user and call next() with a valid token', () => {
    const token = generateTestToken({
      id: 'b3d7c8a0-1234-4abc-9def-000000000001',
      email: 'elena@pyrawood.com',
      role: 'customer',
    });
    const req = createMockRequest({ headers: { authorization: `Bearer ${token}` } }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    auth(req, res, next);

    expect(req.user).toEqual({
      id: 'b3d7c8a0-1234-4abc-9def-000000000001',
      email: 'elena@pyrawood.com',
      role: 'customer',
    });
    expect(next).toHaveBeenCalledWith();
  });

  it('should correctly parse admin role from token', () => {
    const token = generateTestToken({
      id: 'admin-id-001',
      email: 'admin@pyrawood.com',
      role: 'admin',
    });
    const req = createMockRequest({ headers: { authorization: `Bearer ${token}` } }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    auth(req, res, next);

    expect(req.user?.role).toBe('admin');
  });
});

describe('optionalAuth middleware', () => {
  it('should call next() without error when no token is provided', () => {
    const req = createMockRequest({ headers: {} }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeUndefined();
  });

  it('should set req.user when a valid token is present', () => {
    const token = generateTestToken({
      id: 'b3d7c8a0-1234-4abc-9def-000000000001',
      email: 'elena@pyrawood.com',
      role: 'customer',
    });
    const req = createMockRequest({ headers: { authorization: `Bearer ${token}` } }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    optionalAuth(req, res, next);

    expect(req.user).toEqual({
      id: 'b3d7c8a0-1234-4abc-9def-000000000001',
      email: 'elena@pyrawood.com',
      role: 'customer',
    });
    expect(next).toHaveBeenCalledWith();
  });

  it('should proceed without error when token is invalid', () => {
    const req = createMockRequest({ headers: { authorization: 'Bearer bad-token' } }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    optionalAuth(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });
});
