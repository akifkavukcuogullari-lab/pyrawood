import { validate } from '../../../src/middleware/validate';
import { z, ZodError } from 'zod';
import { createMockRequest, createMockResponse, createMockNext } from '../../helpers';
import { Request, Response } from 'express';

const testBodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const testFullSchema = z.object({
  body: z.object({
    name: z.string().min(2),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
  }),
  params: z.object({}).optional(),
});

describe('validate middleware', () => {
  describe('with source="body"', () => {
    it('should call next() with valid body data', () => {
      const middleware = validate(testBodySchema, 'body');
      const req = createMockRequest({
        body: { name: 'Elena Woodsworth', email: 'elena@pyrawood.com' },
      }) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with error for invalid body data', () => {
      const middleware = validate(testBodySchema, 'body');
      const req = createMockRequest({
        body: { name: 'E', email: 'not-an-email' },
      }) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ZodError));
    });

    it('should call next with error when required fields are missing', () => {
      const middleware = validate(testBodySchema, 'body');
      const req = createMockRequest({ body: {} }) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ZodError));
    });
  });

  describe('with source="full" (default)', () => {
    it('should validate and transform body and query together', () => {
      const middleware = validate(testFullSchema);
      const req = createMockRequest({
        body: { name: 'Oak Craftsman Bookshelf' },
        query: { page: '3' },
        params: {},
      }) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      // The query.page should be coerced from string '3' to number 3
      expect(req.query.page).toBe(3);
    });

    it('should call next with error when body is invalid', () => {
      const middleware = validate(testFullSchema);
      const req = createMockRequest({
        body: { name: 'X' }, // too short
        query: {},
        params: {},
      }) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ZodError));
    });
  });

  describe('with source="query"', () => {
    it('should validate query params', () => {
      const querySchema = z.object({
        page: z.coerce.number().int().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
      });
      const middleware = validate(querySchema, 'query');
      const req = createMockRequest({
        query: { page: '2', limit: '20' },
      }) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.query.page).toBe(2);
      expect(req.query.limit).toBe(20);
    });
  });
});
