import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

describe('useMediaQuery', () => {
  let listeners: Map<string, ((event: { matches: boolean }) => void)[]>;

  beforeEach(() => {
    listeners = new Map();

    (window.matchMedia as jest.Mock).mockImplementation((query: string) => {
      if (!listeners.has(query)) {
        listeners.set(query, []);
      }

      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((_event: string, handler: (e: { matches: boolean }) => void) => {
          listeners.get(query)!.push(handler);
        }),
        removeEventListener: jest.fn((_event: string, handler: (e: { matches: boolean }) => void) => {
          const queryListeners = listeners.get(query);
          if (queryListeners) {
            const idx = queryListeners.indexOf(handler);
            if (idx >= 0) queryListeners.splice(idx, 1);
          }
        }),
        dispatchEvent: jest.fn(),
      };
    });
  });

  it('returns false initially (default matchMedia mock returns false)', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('returns true when matchMedia initially matches', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('responds to media query changes', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    // Simulate a media query change
    const queryListeners = listeners.get('(min-width: 768px)');
    expect(queryListeners).toBeDefined();
    expect(queryListeners!.length).toBeGreaterThan(0);

    act(() => {
      queryListeners!.forEach((handler) => handler({ matches: true }));
    });

    expect(result.current).toBe(true);
  });

  it('cleans up listener on unmount', () => {
    const removeEventListener = jest.fn();

    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
