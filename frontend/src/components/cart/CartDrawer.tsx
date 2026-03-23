'use client';

import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '@/components/cart/CartItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isEmpty,
    isOpen,
    closeDrawer,
    updateItem,
    removeItem,
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) closeDrawer(); }}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <SheetTitle className="font-heading text-lg text-pyra-walnut">
              Shopping Cart
            </SheetTitle>
            {itemCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
          <SheetDescription className="sr-only">
            Your shopping cart items
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Discover our collection of handcrafted wood furniture and find pieces you love."
              action={{
                label: 'Start Shopping',
                href: '/products',
              }}
            />
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 px-4">
              <div className="divide-y divide-border">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateItem}
                      onRemove={removeItem}
                      compact
                    />
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Footer with Subtotal and Actions */}
            <SheetFooter className="border-t border-border pt-4">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-heading text-lg font-bold text-pyra-walnut">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>

                <Separator />

                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full bg-pyra-forest text-white hover:bg-pyra-forest/90"
                    size="lg"
                    render={<Link href="/checkout" />}
                    onClick={closeDrawer}
                  >
                    Checkout
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    render={<Link href="/cart" />}
                    onClick={closeDrawer}
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
