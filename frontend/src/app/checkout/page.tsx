'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { Loader2, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageTransition } from '@/components/shared/PageTransition';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { getStripe } from '@/lib/stripe';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, isInitialized } = useAuth();
  const { items, subtotal, isEmpty, isLoading: cartLoading } = useCart();
  const [stripePromise] = useState(() => getStripe());

  useEffect(() => {
    if (isInitialized && !authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, isInitialized, router]);

  if (!isInitialized || authLoading) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-pyra-walnut" />
          </div>
        </section>
      </PageTransition>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (cartLoading) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton className="mb-8 h-9 w-32" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </section>
      </PageTransition>
    );
  }

  if (isEmpty) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-8 font-heading text-3xl font-bold text-pyra-walnut">Checkout</h1>
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add some items to your cart before checking out."
            action={{ label: 'Browse Products', href: '/products' }}
          />
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-heading text-3xl font-bold text-pyra-walnut">
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-24 border-pyra-sand/60 bg-pyra-cream/30">
              <CardContent className="p-6">
                <h2 className="mb-4 font-heading text-lg font-semibold text-pyra-walnut">
                  Order Summary
                </h2>

                {/* Item previews */}
                <div className="mb-4 space-y-2">
                  {items.map((item) => {
                    const price = item.variant?.price ?? item.product.price;
                    return (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="line-clamp-1 flex-1 text-muted-foreground">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="ml-2 font-medium">
                          {formatCurrency(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <CartSummary subtotal={subtotal} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
