'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/lib/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  compact?: boolean;
}

export function CartItem({ item, onUpdateQuantity, onRemove, compact = false }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const price = item.variant?.price ?? item.product.price;
  const imageUrl = item.product.images?.[0]?.url || '/images/placeholder.jpg';
  const imageAlt = item.product.images?.[0]?.altText || item.product.name;

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

  const variantLabel = item.variant
    ? Object.values(item.variant.attributes).join(' / ')
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex gap-3 ${compact ? 'py-3' : 'py-4'} ${isRemoving ? 'pointer-events-none opacity-50' : ''}`}
    >
      {/* Product Image */}
      <Link
        href={`/products/${item.product.slug}`}
        className={`relative flex-shrink-0 overflow-hidden rounded-lg bg-pyra-sand ${compact ? 'size-16' : 'size-20'}`}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes={compact ? '64px' : '80px'}
        />
      </Link>

      {/* Item Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.product.slug}`}
            className="line-clamp-1 text-sm font-medium text-pyra-charcoal hover:text-pyra-walnut"
          >
            {item.product.name}
          </Link>
          {variantLabel && (
            <p className="mt-0.5 text-xs text-muted-foreground">{variantLabel}</p>
          )}
          <p className="mt-0.5 text-sm font-semibold text-pyra-gold">
            {formatCurrency(price)}
          </p>
        </div>

        {/* Quantity Controls + Remove */}
        <div className="mt-2 flex items-center justify-between">
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
              {isUpdating ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                item.quantity
              )}
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

          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
            disabled={isRemoving}
            aria-label={`Remove ${item.product.name}`}
          >
            {isRemoving ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Trash2 className="size-3" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
