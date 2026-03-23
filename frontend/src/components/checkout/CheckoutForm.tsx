'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MapPin, CreditCard, ClipboardList, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AddressForm } from '@/components/checkout/AddressForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { useCart } from '@/hooks/useCart';
import { apiPost } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import { formatCurrency } from '@/lib/utils';
import type { ShippingAddress, Order } from '@/lib/types';

const STEPS = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: ClipboardList },
] as const;

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;

  function handleAddressSubmit(address: ShippingAddress) {
    setShippingAddress(address);
    setStep(2);
  }

  function handlePaymentSubmit(methodId: string) {
    setPaymentMethodId(methodId);
    setStep(3);
  }

  async function handlePlaceOrder() {
    if (!shippingAddress || !paymentMethodId) return;

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      // Create payment intent
      const intentRes = await apiPost<{ clientSecret: string; paymentIntentId: string }>(
        ENDPOINTS.PAYMENTS.CREATE_INTENT,
        { amount: Math.round(total * 100) }
      );

      const paymentIntentId = intentRes.data?.paymentIntentId;
      if (!paymentIntentId) {
        throw new Error('Failed to create payment intent');
      }

      // Create order
      const orderRes = await apiPost<Order>(ENDPOINTS.ORDERS.CREATE, {
        shippingAddress,
        paymentIntentId,
      });

      if (orderRes.data) {
        setConfirmedOrder(orderRes.data);
        clearCart();
      }
    } catch (error) {
      setOrderError(
        error instanceof Error ? error.message : 'Failed to place order. Please try again.'
      );
    } finally {
      setIsPlacingOrder(false);
    }
  }

  // Show confirmation if order placed
  if (confirmedOrder) {
    return (
      <OrderConfirmation
        orderId={confirmedOrder.id}
        items={confirmedOrder.items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        }))}
        subtotal={confirmedOrder.subtotal}
        tax={confirmedOrder.tax}
        shippingCost={confirmedOrder.shippingCost}
        total={confirmedOrder.total}
        shippingAddress={confirmedOrder.shippingAddress}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <nav aria-label="Checkout progress" className="mx-auto max-w-md">
        <ol className="flex items-center justify-between">
          {STEPS.map((s, index) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            const Icon = s.icon;

            return (
              <li key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full border-2 transition-colors ${
                      isCompleted
                        ? 'border-pyra-forest bg-pyra-forest text-white'
                        : isActive
                          ? 'border-pyra-forest bg-pyra-forest/10 text-pyra-forest'
                          : 'border-border bg-background text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="size-5" />
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isActive || isCompleted ? 'text-pyra-forest' : 'text-muted-foreground'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-3 mt-[-18px] h-0.5 w-16 sm:w-24 ${
                      step > s.id ? 'bg-pyra-forest' : 'bg-border'
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-pyra-sand/60 bg-pyra-cream/30">
              <CardContent className="p-6">
                <AddressForm
                  onSubmit={handleAddressSubmit}
                  defaultValues={shippingAddress || undefined}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-pyra-sand/60 bg-pyra-cream/30">
              <CardContent className="p-6">
                <PaymentForm
                  onSubmit={handlePaymentSubmit}
                  onBack={() => setStep(1)}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-pyra-sand/60 bg-pyra-cream/30">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-heading text-lg font-semibold text-pyra-walnut">
                  Review Your Order
                </h3>

                {/* Items Preview */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const price = item.variant?.price ?? item.product.price;
                    const imageUrl = item.product.images?.[0]?.url || '/images/placeholder.jpg';
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative size-12 flex-shrink-0 overflow-hidden rounded-lg bg-pyra-sand">
                          <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-pyra-charcoal">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatCurrency(price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Shipping Address Summary */}
                {shippingAddress && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-pyra-charcoal">
                        Shipping Address
                      </h4>
                      <Button
                        variant="link"
                        size="xs"
                        className="text-pyra-forest"
                        onClick={() => setStep(1)}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      <p>{shippingAddress.fullName}</p>
                      <p>{shippingAddress.addressLine1}</p>
                      {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                      <p>
                        {shippingAddress.city}, {shippingAddress.state}{' '}
                        {shippingAddress.postalCode}
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Payment Summary */}
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-pyra-charcoal">Payment</h4>
                    <Button
                      variant="link"
                      size="xs"
                      className="text-pyra-forest"
                      onClick={() => setStep(2)}
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Card ending in ****
                  </p>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="font-heading text-lg text-pyra-walnut">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {orderError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {orderError}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="lg"
                    onClick={() => setStep(2)}
                    disabled={isPlacingOrder}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-pyra-forest text-white hover:bg-pyra-forest/90"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="mr-1 size-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
