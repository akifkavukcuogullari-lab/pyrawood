import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validation middleware factory.
 *
 * Accepts a Zod schema and an optional source parameter to specify which
 * part of the request to validate. If the schema validates an object with
 * 'body', 'query', and/or 'params' keys, pass source as 'full' (default)
 * to validate the entire request shape. Otherwise, pass 'body', 'query',
 * or 'params' to validate only that specific part.
 */
export function validate(
  schema: ZodSchema,
  source: 'full' | 'body' | 'query' | 'params' = 'full'
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (source === 'full') {
        // Schema expects { body?, query?, params? }
        const result = schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });

        // Overwrite request data with parsed (and potentially transformed) values
        if (result.body !== undefined) req.body = result.body;
        if (result.query !== undefined) (req as any).query = result.query;
        if (result.params !== undefined) (req as any).params = result.params;
      } else {
        const data = req[source];
        const result = schema.parse(data);

        if (source === 'body') {
          req.body = result;
        } else if (source === 'query') {
          (req as any).query = result;
        } else if (source === 'params') {
          (req as any).params = result;
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
