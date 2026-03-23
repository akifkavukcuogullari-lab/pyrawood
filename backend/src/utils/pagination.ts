const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;

interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Parse pagination parameters from a query object.
 * Ensures safe defaults and bounds.
 */
export function parsePagination(query: Record<string, unknown>): PaginationParams {
  let page = parseInt(String(query.page || DEFAULT_PAGE), 10);
  let limit = parseInt(String(query.limit || DEFAULT_LIMIT), 10);

  if (isNaN(page) || page < 1) page = DEFAULT_PAGE;
  if (isNaN(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Build a pagination metadata object for the response.
 */
export function buildPaginationResponse(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
