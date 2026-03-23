'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageTransition } from '@/components/shared/PageTransition';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import type { CartItem } from '@/lib/types';

// export const metadata is not allowed in 'use client' pages
// metadata is handled via the layout or a separate metadata export file

function CartItemRow({ item, onUpdateQuantity, onRemove }: {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const price = item.variant?.price ?? item.product.price;
  const imageUrl = item.product.images?.[0]?.url || '/images/placeholder.jpg';
  const imageAlt = item.product.images?.[0]?.altText || item.product.name;
  const variantLabel = item.variant
    ? Object.values(item.variant.attributes).join(' / ')
    : null;

  async function handleQuantityChange(newQuantity: number) {
    if (newQuantity < 1 || isUpdating) return;
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemove() {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`border-b transition-colors hover:bg-muted/50 ${isRemoving ? 'opacity-50' : ''}`}
    >
      {/* Product */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Link
            href={`/products/${item.product.slug}`}
            className="relative size-16 flex-shrink-0 overflow-hidden rounded-lg bg-pyra-sand"
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="64px"
            />
          </Link>
          <div>
            <Link
              href={`/products/${item.product.slug}`}
              className="font-medium text-pyra-charcoal hover:text-pyra-walnut"
            >
              {item.product.name}
            </Link>
            {variantLabel && (
              <p className="mt-0.5 text-xs text-muted-foreground">{variantLabel}</p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Price */}
      <TableCell className="text-sm font-medium">
        {formatCurrency(price)}
      </TableCell>

      {/* Quantity */}
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || isUpdating}
            aria-label="Decrease quantity"
          >
            <Minus className="size-3" />
          </Button>
          <span className="flex w-8 items-center justify-center text-sm font-medium">
            {isUpdating ? <Loader2 className="size-3 animate-spin" /> : item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
            aria-label="Increase quantity"
          >
            <Plus className="size-3" />
          </Button>
        </div>
      </TableCell>

      {/* Total */}
      <TableCell className="text-sm font-semibold text-pyra-gold">
        {formatCurrency(price * item.quantity)}
      </TableCell>

      {/* Remove */}
      <TableCell>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label={`Remove ${item.product.name}`}
        >
          {isRemoving ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
        </Button>
      </TableCell>
    </motion.tr>
  );
}

export default function CartPage() {
  const { items, subtotal, isEmpty, isLoading, updateItem, removeItem } = useCart();

  if (isLoading) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton className="mb-8 h-9 w-48" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </section>
      </PageTransition>
    );
  }

  if (isEmpty) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-8 font-heading text-3xl font-bold text-pyra-walnut">
            Shopping Cart
          </h1>
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Browse our artisan wood furniture collection and find the perfect pieces for your home."
            action={{ label: 'Start Shopping', href: '/products' }}
          />
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold text-pyra-walnut">
            Shopping Cart
          </h1>
          <Button
            variant="ghost"
            className="text-muted-foreground"
            render={<Link href="/products" />}
          >
            <ArrowLeft className="mr-1 size-4" />
            Continue Shopping
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items Table */}
          <div className="lg:col-span-2">
            <Card className="border-pyra-sand/60 bg-pyra-cream/30">
              <CardContent className="p-0">
                {/* Desktop Table */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                          <CartItemRow
                            key={item.id}
                            item={item}
                            onUpdateQuantity={updateItem}
                            onRemove={removeItem}
                          />
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile List */}
                <div className="divide-y divide-border p-4 sm:hidden">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <MobileCartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateItem}
                        onRemove={removeItem}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24 border-pyra-sand/60 bg-pyra-cream/30">
              <CardContent className="p-6">
                <h2 className="mb-4 font-heading text-lg font-semibold text-pyra-walnut">
                  Order Summary
                </h2>
                <CartSummary subtotal={subtotal} />
                <div className="mt-6">
                  <Button
                    className="w-full bg-pyra-forest text-white hover:bg-pyra-forest/90"
                    size="lg"
                    render={<Link href="/checkout" />}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

function MobileCartItem({ item, onUpdateQuantity, onRemove }: {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const price = item.variant?.price ?? item.product.price;
  const imageUrl = item.product.images?.[0]?.url || '/images/placeholder.jpg';
  const imageAlt = item.product.images?.[0]?.altText || item.product.name;
  const variantLabel = item.variant
    ? Object.values(item.variant.attributes).join(' / ')
    : null;

  async function handleQuantityChange(newQuantity: number) {
    if (newQuantity < 1 || isUpdating) return;
    setIsUpdating(true);
    try { await onUpdateQuantity(item.id, newQuantity); }
    finally { setIsUpdating(false); }
  }

  async function handleRemove() {
    if (isRemoving) return;
    setIsRemoving(true);
    try { await onRemove(item.id); }
    finally { setIsRemoving(false); }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex gap-3 py-4 ${isRemoving ? 'opacity-50' : ''}`}
    >
      <Link
        href={`/products/${item.product.slug}`}
        className="relative size-20 flex-shrink-0 overflow-hidden rounded-lg bg-pyra-sand"
      >
        <Image src={imageUrl} alt={imageAlt} fill className="object-cover" sizes="80px" />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/products/${item.product.slug}`} className="text-sm font-medium text-pyra-charcoal hover:text-pyra-walnut">
            {item.product.name}
          </Link>
          {variantLabel && <p className="text-xs text-muted-foreground">{variantLabel}</p>}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-xs" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1 || isUpdating}>
              <Minus className="size-3" />
            </Button>
            <span className="flex w-8 items-center justify-center text-sm font-medium">
              {isUpdating ? <Loader2 className="size-3 animate-spin" /> : item.quantity}
            </span>
            <Button variant="outline" size="icon-xs" onClick={() => handleQuantityChange(item.quantity + 1)} disabled={isUpdating}>
              <Plus className="size-3" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-pyra-gold">{formatCurrency(price * item.quantity)}</span>
            <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-destructive" onClick={handleRemove} disabled={isRemoving}>
              {isRemoving ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
