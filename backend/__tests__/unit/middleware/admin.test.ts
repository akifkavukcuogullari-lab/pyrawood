import { admin } from '../../../src/middleware/admin';
import { createMockRequest, createMockResponse, createMockNext } from '../../helpers';
import { UnauthorizedError, ForbiddenError } from '../../../src/utils/errors';
import { Request, Response } from 'express';

describe('admin middleware', () => {
  it('should call next with UnauthorizedError when req.user is not set', () => {
    const req = createMockRequest({}) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    admin(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should call next with ForbiddenError when user role is customer', () => {
    const req = createMockRequest({
      user: { id: 'user-1', email: 'customer@example.com', role: 'customer' },
    }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    admin(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it('should call next() without error when user role is admin', () => {
    const req = createMockRequest({
      user: { id: 'admin-1', email: 'admin@pyrawood.com', role: 'admin' },
    }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    admin(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with ForbiddenError for any non-admin role', () => {
    const req = createMockRequest({
      user: { id: 'user-2', email: 'manager@pyrawood.com', role: 'manager' },
    }) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    admin(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });
});
