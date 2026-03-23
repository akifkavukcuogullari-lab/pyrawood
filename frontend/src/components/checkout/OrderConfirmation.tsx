'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import type { ShippingAddress } from '@/lib/types';

interface OrderConfirmationProps {
  orderId: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
}

export function OrderConfirmation({
  orderId,
  items,
  subtotal,
  tax,
  shippingCost,
  total,
  shippingAddress,
}: OrderConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl"
    >
      {/* Success Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-pyra-forest/10"
        >
          <CheckCircle className="size-10 text-pyra-forest" />
        </motion.div>
        <h1 className="font-heading text-3xl font-bold text-pyra-walnut">
          Order Confirmed!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your order. We will send you a confirmation email shortly.
        </p>
        <p className="mt-1 font-mono text-sm text-pyra-gold">
          Order #{orderId.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Order Details */}
      <Card className="border-pyra-sand/60 bg-pyra-cream/30">
        <CardContent className="p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-pyra-walnut">
            Order Summary
          </h2>

          {/* Items */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-pyra-charcoal">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <span className="font-heading text-base font-semibold">Total</span>
            <span className="font-heading text-lg font-bold text-pyra-walnut">
              {formatCurrency(total)}
            </span>
          </div>

          <Separator className="my-4" />

          {/* Shipping Address */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-pyra-charcoal">
              Shipping To
            </h3>
            <div className="text-sm text-muted-foreground">
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          className="flex-1 bg-pyra-forest text-white hover:bg-pyra-forest/90"
          size="lg"
          render={<Link href={`/orders/${orderId}`} />}
        >
          <Package className="mr-1 size-4" />
          View Order
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          size="lg"
          render={<Link href="/products" />}
        >
          Continue Shopping
          <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>
    </motion.div>
  );
}
