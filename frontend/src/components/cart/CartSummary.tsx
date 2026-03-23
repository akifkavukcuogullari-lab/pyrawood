'use client';

import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

interface CartSummaryProps {
  subtotal: number;
  className?: string;
}

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

export function CartSummary({ subtotal, className }: CartSummaryProps) {
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;

  return (
    <div className={className}>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-pyra-forest">Free</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        {shipping > 0 && (
          <p className="text-xs text-muted-foreground">
            Free shipping on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}
          </p>
        )}
      </div>

      <Separator className="my-3" />

      <div className="flex items-center justify-between">
        <span className="font-heading text-base font-semibold text-pyra-charcoal">Total</span>
        <span className="font-heading text-lg font-bold text-pyra-walnut">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}
