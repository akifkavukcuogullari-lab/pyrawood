import { apiGet, apiPost, ApiError } from '@/lib/api';
import * as auth from '@/lib/auth';

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  getToken: jest.fn(),
  removeToken: jest.fn(),
}));

const mockGetToken = auth.getToken as jest.Mock;
const mockRemoveToken = auth.removeToken as jest.Mock;

// Save original fetch
const originalFetch = global.fetch;

beforeEach(() => {
  jest.clearAllMocks();
  mockGetToken.mockReturnValue(null);

  // Reset location mock
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '/', pathname: '/' },
  });
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('apiGet', () => {
  it('makes a GET request to the correct URL', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true, data: { id: '1', name: 'Walnut Dining Table' } }),
    });

    const result = await apiGet('/products/1');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/products/1'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: '1', name: 'Walnut Dining Table' });
  });

  it('appends query parameters correctly', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true, data: [] }),
    });

    await apiGet('/products', { category: 'dining', page: 1 });

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain('category=dining');
    expect(calledUrl).toContain('page=1');
  });

  it('adds Authorization header when token exists', async () => {
    mockGetToken.mockReturnValue('my-jwt-token');

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true, data: null }),
    });

    await apiGet('/products');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer my-jwt-token',
        }),
      })
    );
  });

  it('does not add Authorization header when no token', async () => {
    mockGetToken.mockReturnValue(null);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true, data: null }),
    });

    await apiGet('/products');

    const calledHeaders = (global.fetch as jest.Mock).mock.calls[0][1].headers;
    expect(calledHeaders).not.toHaveProperty('Authorization');
  });
});

describe('API error handling', () => {
  it('throws ApiError on non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({
        error: { message: 'Invalid request', code: 'BAD_REQUEST' },
      }),
    });

    await expect(apiGet('/products')).rejects.toThrow('Invalid request');
  });

  it('handles 401 by removing token and redirecting', async () => {
    mockGetToken.mockReturnValue('expired-token');

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({
        error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
      }),
    });

    await expect(apiGet('/cart')).rejects.toThrow('Unauthorized');
    expect(mockRemoveToken).toHaveBeenCalled();
  });
});

describe('apiPost', () => {
  it('makes a POST request with body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({
        success: true,
        data: { token: 'new-token', user: { id: '1', name: 'Test User' } },
      }),
    });

    const result = await apiPost('/auth/register', {
      name: 'Test User',
      email: 'customer@example.com',
      password: 'customer123',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'customer@example.com',
          password: 'customer123',
        }),
      })
    );
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('token');
  });
});
