import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

/**
 * Admin authorization middleware.
 * Must be used after the auth middleware so that req.user is set.
 */
export function admin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  if (req.user.role !== 'admin') {
    return next(new ForbiddenError());
  }

  next();
}
