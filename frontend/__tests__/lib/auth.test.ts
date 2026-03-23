import { getToken, setToken, removeToken } from '@/lib/auth';

describe('Token management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getToken returns null when no token is stored', () => {
    expect(getToken()).toBeNull();
  });

  it('setToken stores a token and getToken retrieves it', () => {
    setToken('test-jwt-token-12345');
    expect(getToken()).toBe('test-jwt-token-12345');
  });

  it('removeToken clears the stored token', () => {
    setToken('test-jwt-token-12345');
    expect(getToken()).toBe('test-jwt-token-12345');
    removeToken();
    expect(getToken()).toBeNull();
  });

  it('setToken overwrites existing token', () => {
    setToken('first-token');
    setToken('second-token');
    expect(getToken()).toBe('second-token');
  });
});

describe('SSR safety (window undefined)', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    // Simulate server-side environment
    // @ts-expect-error - deliberately removing window
    delete global.window;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it('getToken returns null when window is undefined', () => {
    expect(getToken()).toBeNull();
  });

  it('setToken does not throw when window is undefined', () => {
    expect(() => setToken('some-token')).not.toThrow();
  });

  it('removeToken does not throw when window is undefined', () => {
    expect(() => removeToken()).not.toThrow();
  });
});
