import { errorHandler } from '../../../src/middleware/errorHandler';
import { AppError, NotFoundError, ValidationError } from '../../../src/utils/errors';
import { ZodError, ZodIssue } from 'zod';
import { createMockRequest, createMockResponse, createMockNext } from '../../helpers';
import { Request, Response } from 'express';

describe('errorHandler middleware', () => {
  const req = createMockRequest() as Request;
  const next = createMockNext();

  it('should return correct status and message for AppError', () => {
    const res = createMockResponse();
    const error = new NotFoundError('Product');

    errorHandler(error, req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Product not found',
        code: 'NOT_FOUND',
      },
    });
  });

  it('should return 400 for ValidationError', () => {
    const res = createMockResponse();
    const error = new ValidationError('Price must be positive');

    errorHandler(error, req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Price must be positive',
        code: 'VALIDATION_ERROR',
      },
    });
  });

  it('should return 400 for ZodError with formatted details', () => {
    const res = createMockResponse();
    const issues: ZodIssue[] = [
      {
        code: 'too_small',
        minimum: 2,
        type: 'string',
        inclusive: true,
        exact: false,
        message: 'Name must be at least 2 characters',
        path: ['body', 'name'],
      },
      {
        code: 'invalid_string',
        validation: 'email',
        message: 'Invalid email address',
        path: ['body', 'email'],
      },
    ];
    const zodError = new ZodError(issues);

    errorHandler(zodError, req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: [
          { path: 'body.name', message: 'Name must be at least 2 characters' },
          { path: 'body.email', message: 'Invalid email address' },
        ],
      },
    });
  });

  it('should return 500 for unknown errors in non-production', () => {
    const res = createMockResponse();
    const error = new Error('Database connection failed');

    // Suppress console.error during test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    errorHandler(error, req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Database connection failed',
        code: 'INTERNAL_ERROR',
      },
    });

    consoleSpy.mockRestore();
  });

  it('should hide error details in production', () => {
    const res = createMockResponse();
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Sensitive database error details');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    errorHandler(error, req, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    });

    process.env.NODE_ENV = originalEnv;
    consoleSpy.mockRestore();
  });
});
