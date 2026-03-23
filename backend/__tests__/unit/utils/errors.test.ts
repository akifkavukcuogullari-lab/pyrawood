import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '../../../src/utils/errors';

describe('AppError', () => {
  it('should set message, statusCode and code', () => {
    const error = new AppError('Something went wrong', 500, 'INTERNAL');
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL');
  });

  it('should be an instance of Error', () => {
    const error = new AppError('test', 400, 'TEST');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });
});

describe('NotFoundError', () => {
  it('should default to "Resource not found"', () => {
    const error = new NotFoundError();
    expect(error.message).toBe('Resource not found');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
  });

  it('should accept a custom resource name', () => {
    const error = new NotFoundError('Product');
    expect(error.message).toBe('Product not found');
  });

  it('should be an instance of AppError', () => {
    expect(new NotFoundError()).toBeInstanceOf(AppError);
  });
});

describe('ValidationError', () => {
  it('should default to "Validation failed"', () => {
    const error = new ValidationError();
    expect(error.message).toBe('Validation failed');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
  });

  it('should accept a custom message', () => {
    const error = new ValidationError('Invalid price');
    expect(error.message).toBe('Invalid price');
  });
});

describe('UnauthorizedError', () => {
  it('should default to "Authentication required"', () => {
    const error = new UnauthorizedError();
    expect(error.message).toBe('Authentication required');
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
  });

  it('should accept a custom message', () => {
    const error = new UnauthorizedError('Invalid email or password');
    expect(error.message).toBe('Invalid email or password');
  });
});

describe('ForbiddenError', () => {
  it('should default to "Access denied"', () => {
    const error = new ForbiddenError();
    expect(error.message).toBe('Access denied');
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe('FORBIDDEN');
  });
});

describe('ConflictError', () => {
  it('should default to "Resource already exists"', () => {
    const error = new ConflictError();
    expect(error.message).toBe('Resource already exists');
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe('CONFLICT');
  });

  it('should accept a custom message', () => {
    const error = new ConflictError('Email already registered');
    expect(error.message).toBe('Email already registered');
  });
});
