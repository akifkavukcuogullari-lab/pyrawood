import { parsePagination, buildPaginationResponse } from '../../../src/utils/pagination';

describe('parsePagination', () => {
  it('should parse valid page and limit', () => {
    const result = parsePagination({ page: '3', limit: '20' });
    expect(result).toEqual({ page: 3, limit: 20, offset: 40 });
  });

  it('should use defaults when page and limit are missing', () => {
    const result = parsePagination({});
    expect(result).toEqual({ page: 1, limit: 12, offset: 0 });
  });

  it('should default page to 1 when invalid', () => {
    const result = parsePagination({ page: 'abc', limit: '10' });
    expect(result.page).toBe(1);
    expect(result.offset).toBe(0);
  });

  it('should default limit to 12 when invalid', () => {
    const result = parsePagination({ page: '1', limit: 'xyz' });
    expect(result.limit).toBe(12);
  });

  it('should cap limit at MAX_LIMIT (100)', () => {
    const result = parsePagination({ page: '1', limit: '200' });
    expect(result.limit).toBe(100);
  });

  it('should default negative page to 1', () => {
    const result = parsePagination({ page: '-5', limit: '10' });
    expect(result.page).toBe(1);
  });

  it('should default negative limit to 12', () => {
    const result = parsePagination({ page: '1', limit: '-10' });
    expect(result.limit).toBe(12);
  });

  it('should calculate offset correctly', () => {
    const result = parsePagination({ page: '5', limit: '25' });
    expect(result.offset).toBe(100);
  });
});

describe('buildPaginationResponse', () => {
  it('should calculate totalPages correctly', () => {
    const result = buildPaginationResponse(50, 1, 12);
    expect(result).toEqual({
      page: 1,
      limit: 12,
      total: 50,
      totalPages: 5,
    });
  });

  it('should return totalPages of 1 when total is 0', () => {
    const result = buildPaginationResponse(0, 1, 12);
    expect(result.totalPages).toBe(1);
  });

  it('should round up totalPages', () => {
    const result = buildPaginationResponse(13, 1, 12);
    expect(result.totalPages).toBe(2);
  });

  it('should return exact totalPages when evenly divisible', () => {
    const result = buildPaginationResponse(24, 1, 12);
    expect(result.totalPages).toBe(2);
  });
});
