'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  stock: number;
  productName: string;
}

export function AddToCartButton({
  productId,
  variantId,
  stock,
  productName,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const isOutOfStock = stock === 0;

  const handleAdd = async () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    try {
      await addItem({ productId, variantId, quantity });
      setJustAdded(true);
      toast.success(`${productName} added to cart`);
      setTimeout(() => setJustAdded(false), 2000);
    } catch {
      toast.error('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-pyra-charcoal">Quantity</span>
        <div className="flex items-center rounded-lg border border-pyra-sand">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="rounded-r-none"
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="flex w-10 items-center justify-center text-sm font-medium tabular-nums">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={quantity >= stock}
            className="rounded-l-none"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Add to Cart button */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          size="lg"
          className={cn(
            'w-full gap-2 text-base font-semibold transition-colors',
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : justAdded
                ? 'bg-pyra-gold text-white hover:bg-pyra-gold/90'
                : 'bg-pyra-forest text-white hover:bg-pyra-gold'
          )}
          onClick={handleAdd}
          disabled={isOutOfStock || isAdding}
        >
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="size-5 animate-spin" />
                Adding...
              </motion.span>
            ) : justAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                Added to Cart
              </motion.span>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="size-5" />
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
}
