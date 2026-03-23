'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const loadCart = useCartStore((state) => state.loadCart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      clearCart();
    }
  }, [user, loadCart, clearCart]);

  return <>{children}</>;
}
