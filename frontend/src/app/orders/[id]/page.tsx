'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Loader2,
  X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageTransition } from '@/components/shared/PageTransition';
import { useAuth } from '@/hooks/useAuth';
import { useOrder } from '@/hooks/useOrders';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const { isAuthenticated, isLoading: authLoading, isInitialized } = useAuth();
  const { order, isLoading, error } = useOrder(orderId);

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

  if (isLoading) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton className="mb-4 h-6 w-48" />
          <Skeleton className="mb-8 h-9 w-64" />
          <Skeleton className="mb-8 h-24 w-full rounded-xl" />
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

  if (error || !order) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error || 'Order not found'}
          </div>
        </section>
      </PageTransition>
    );
  }

  const currentStepIndex = STATUS_ORDER[order.status];
  const isCancelled = order.status === 'cancelled';

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/orders" className="hover:text-pyra-walnut">
            My Orders
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-pyra-charcoal">
            #{order.id.slice(0, 8).toUpperCase()}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-pyra-walnut">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Button
            variant="outline"
            render={<Link href="/orders" />}
          >
            <ArrowLeft className="mr-1 size-4" />
            Back to Orders
          </Button>
        </div>

        {/* Status Timeline */}
        <Card className="mb-8 border-pyra-sand/60 bg-pyra-cream/30">
          <CardContent className="p-6">
            {isCancelled ? (
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                  <X className="size-5 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-destructive">Order Cancelled</p>
                  <p className="text-sm text-muted-foreground">
                    This order has been cancelled.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between overflow-x-auto">
                {STATUS_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isComplete = currentStepIndex >= index;
                  const isCurrent = currentStepIndex === index;

                  return (
                    <div key={step.status} className="flex items-center">
                      <div className="flex flex-col items-center gap-1">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isCurrent ? 1.1 : 1,
                          }}
                          className={`flex size-10 items-center justify-center rounded-full border-2 transition-colors ${
                            isComplete
                              ? 'border-pyra-forest bg-pyra-forest text-white'
                              : 'border-border bg-background text-muted-foreground'
                          }`}
                        >
                          <Icon className="size-5" />
                        </motion.div>
                        <span
                          className={`whitespace-nowrap text-xs font-medium ${
                            isComplete ? 'text-pyra-forest' : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < STATUS_STEPS.length - 1 && (
                        <div
                          className={`mx-2 mt-[-18px] h-0.5 w-8 sm:w-16 md:w-24 ${
                            currentStepIndex > index ? 'bg-pyra-forest' : 'bg-border'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items Table */}
          <div className="lg:col-span-2">
            <Card className="border-pyra-sand/60 bg-pyra-cream/30">
              <CardContent className="p-0 sm:p-6">
                <h2 className="hidden px-4 pt-4 font-heading text-lg font-semibold text-pyra-walnut sm:block sm:px-0 sm:pt-0">
                  Items
                </h2>
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-pyra-charcoal">{item.name}</p>
                              {Object.keys(item.attributes).length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  {Object.values(item.attributes).join(' / ')}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Totals */}
            <Card className="border-pyra-sand/60 bg-pyra-cream/30">
              <CardContent className="p-6">
                <h2 className="mb-4 font-heading text-lg font-semibold text-pyra-walnut">
                  Summary
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {order.shippingCost === 0 ? (
                        <span className="text-pyra-forest">Free</span>
                      ) : (
                        formatCurrency(order.shippingCost)
                      )}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-semibold">Total</span>
                    <span className="font-heading text-lg font-bold text-pyra-walnut">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mt-4">
                  <Badge
                    variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}
                    className={
                      order.paymentStatus === 'paid'
                        ? 'bg-pyra-forest/10 text-pyra-forest border-pyra-forest/20'
                        : order.paymentStatus === 'failed'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : ''
                    }
                  >
                    Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-pyra-sand/60 bg-pyra-cream/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-pyra-walnut" />
                  <h2 className="font-heading text-lg font-semibold text-pyra-walnut">
                    Shipping Address
                  </h2>
                </div>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-pyra-charcoal">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
