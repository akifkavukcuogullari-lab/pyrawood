'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Loader2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageTransition } from '@/components/shared/PageTransition';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-pyra-gold/10 text-pyra-gold border-pyra-gold/20',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
  },
  processing: {
    label: 'Processing',
    className: 'bg-pyra-gold/10 text-pyra-gold border-pyra-gold/20',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-pyra-forest/10 text-pyra-forest border-pyra-forest/20',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, isInitialized } = useAuth();
  const { orders, isLoading: ordersLoading, error } = useOrders();

  useEffect(() => {
    if (isInitialized && !authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
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

  if (!isAuthenticated) return null;

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-heading text-3xl font-bold text-pyra-walnut">
          My Orders
        </h1>

        {ordersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order, it will appear here. Start exploring our collection of handcrafted furniture."
            action={{ label: 'Start Shopping', href: '/products' }}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusConfig = STATUS_CONFIG[order.status];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/orders/${order.id}`}>
                    <Card className="border-pyra-sand/60 bg-pyra-cream/30 transition-colors hover:bg-pyra-cream/50">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            {/* Order Header */}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-pyra-walnut">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <Badge
                                variant="outline"
                                className={statusConfig.className}
                              >
                                {statusConfig.label}
                              </Badge>
                            </div>

                            {/* Date and Total */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="size-3.5" />
                                {formatDate(order.createdAt)}
                              </span>
                              <span className="font-semibold text-pyra-charcoal">
                                {formatCurrency(order.total)}
                              </span>
                            </div>

                            {/* Items Preview */}
                            <p className="line-clamp-1 text-sm text-muted-foreground">
                              {order.items
                                .map((item) => `${item.name} x${item.quantity}`)
                                .join(', ')}
                            </p>
                          </div>

                          <ChevronRight className="mt-1 size-5 flex-shrink-0 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </PageTransition>
  );
}
