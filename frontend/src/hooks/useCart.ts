'use client';

import { useCartStore } from '@/store/cart-store';

export function useCart() {
  const {
    cart,
    isOpen,
    isLoading,
    loadCart,
    addItem,
    updateItem,
    removeItem,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    clearCart,
  } = useCartStore();

  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.variant?.price ?? item.product.price) * item.quantity,
    0
  );

  return {
    cart,
    items,
    itemCount,
    subtotal,
    isOpen,
    isLoading,
    isEmpty: items.length === 0,
    loadCart,
    addItem,
    updateItem,
    removeItem,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    clearCart,
  };
}
