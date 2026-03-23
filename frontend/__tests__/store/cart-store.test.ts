import { useCartStore } from '@/store/cart-store';
import { act } from '@testing-library/react';

// Mock dependencies
jest.mock('@/lib/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPut: jest.fn(),
  apiDelete: jest.fn(),
}));

jest.mock('@/lib/api-contract', () => ({
  ENDPOINTS: {
    CART: {
      GET: '/cart',
      ADD_ITEM: '/cart/items',
      UPDATE_ITEM: (id: string) => `/cart/items/${id}`,
      REMOVE_ITEM: (id: string) => `/cart/items/${id}`,
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  useCartStore.setState({
    cart: null,
    isOpen: false,
    isLoading: false,
  });
});

describe('CartStore', () => {
  describe('initial state', () => {
    it('has null cart and closed drawer', () => {
      const state = useCartStore.getState();
      expect(state.cart).toBeNull();
      expect(state.isOpen).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('toggleDrawer', () => {
    it('toggles isOpen from false to true', () => {
      act(() => {
        useCartStore.getState().toggleDrawer();
      });
      expect(useCartStore.getState().isOpen).toBe(true);
    });

    it('toggles isOpen from true to false', () => {
      useCartStore.setState({ isOpen: true });
      act(() => {
        useCartStore.getState().toggleDrawer();
      });
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe('openDrawer', () => {
    it('sets isOpen to true', () => {
      act(() => {
        useCartStore.getState().openDrawer();
      });
      expect(useCartStore.getState().isOpen).toBe(true);
    });

    it('stays true if already open', () => {
      useCartStore.setState({ isOpen: true });
      act(() => {
        useCartStore.getState().openDrawer();
      });
      expect(useCartStore.getState().isOpen).toBe(true);
    });
  });

  describe('closeDrawer', () => {
    it('sets isOpen to false', () => {
      useCartStore.setState({ isOpen: true });
      act(() => {
        useCartStore.getState().closeDrawer();
      });
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe('clearCart', () => {
    it('sets cart to null', () => {
      useCartStore.setState({
        cart: {
          id: 'cart-1',
          userId: 'user-1',
          items: [],
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
        },
      });
      act(() => {
        useCartStore.getState().clearCart();
      });
      expect(useCartStore.getState().cart).toBeNull();
    });
  });
});
