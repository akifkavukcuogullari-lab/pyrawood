import { create } from 'zustand';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import type { Cart, AddToCartRequest } from '@/lib/types';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;

  loadCart: () => Promise<void>;
  addItem: (data: AddToCartRequest) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isOpen: false,
  isLoading: false,

  loadCart: async () => {
    set({ isLoading: true });
    try {
      const res = await apiGet<Cart>(ENDPOINTS.CART.GET);
      set({ cart: res.data ?? null, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (data) => {
    set({ isLoading: true });
    try {
      const res = await apiPost<Cart>(ENDPOINTS.CART.ADD_ITEM, data);
      set({ cart: res.data ?? null, isLoading: false, isOpen: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateItem: async (itemId, quantity) => {
    const { cart } = get();

    // Optimistic update
    if (cart) {
      const optimisticItems = cart.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      set({ cart: { ...cart, items: optimisticItems } });
    }

    try {
      const res = await apiPut<Cart>(ENDPOINTS.CART.UPDATE_ITEM(itemId), {
        quantity,
      });
      set({ cart: res.data ?? null });
    } catch (error) {
      // Revert on failure
      if (cart) set({ cart });
      throw error;
    }
  },

  removeItem: async (itemId) => {
    const { cart } = get();

    // Optimistic update
    if (cart) {
      const optimisticItems = cart.items.filter((item) => item.id !== itemId);
      set({ cart: { ...cart, items: optimisticItems } });
    }

    try {
      const res = await apiDelete<Cart>(ENDPOINTS.CART.REMOVE_ITEM(itemId));
      set({ cart: res.data ?? null });
    } catch (error) {
      // Revert on failure
      if (cart) set({ cart });
      throw error;
    }
  },

  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  clearCart: () => set({ cart: null }),
}));
