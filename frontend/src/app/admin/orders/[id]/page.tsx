'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { apiGet, apiPut } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order, OrderStatus } from '@/lib/types';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { OrderTimeline } from '@/components/admin/OrderTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

const allStatuses: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiGet<Order>(ENDPOINTS.ADMIN.ORDERS.DETAIL(id));
        if (res.data) {
          setOrder(res.data);
          setNewStatus(res.data.status);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load order'
        );
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleStatusUpdate() {
    if (!newStatus || !order || newStatus === order.status) return;
    setIsUpdating(true);
    try {
      const res = await apiPut<Order>(
        ENDPOINTS.ADMIN.ORDERS.UPDATE_STATUS(id),
        { status: newStatus }
      );
      if (res.data) {
        setOrder(res.data);
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update status'
      );
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" render={<Link href="/admin/orders" />}>
          <ChevronLeft className="size-4 mr-1" />
          Back to Orders
        </Button>
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error ?? 'Order not found'}
        </div>
      </div>
    );
  }

  const addr = order.shippingAddress;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" render={<Link href="/admin/orders" />}>
          <ChevronLeft className="size-4 mr-1" />
          Orders
        </Button>
        <span>/</span>
        <span className="text-foreground">#{order.id.slice(0, 8)}</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-playfair text-2xl font-semibold text-foreground">
          Order #{order.id.slice(0, 8)}
        </h2>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Order items + totals + customer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-playfair text-lg">
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {Object.keys(item.attributes).length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {Object.entries(item.attributes)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <div className="space-y-1.5 text-sm">
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
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer + Shipping */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Customer Info
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">
                  {order.user?.name ?? addr.fullName}
                </p>
                {order.user?.email && (
                  <p className="text-muted-foreground">{order.user.email}</p>
                )}
                <p className="text-muted-foreground">
                  Ordered {formatDate(order.createdAt)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-0.5 text-muted-foreground">
                <p className="font-medium text-foreground">{addr.fullName}</p>
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p>{addr.country}</p>
                {addr.phone && <p>Phone: {addr.phone}</p>}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right sidebar: Status + Timeline */}
        <div className="space-y-6">
          {/* Status update */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Update Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={newStatus || undefined}
                onValueChange={(val) => setNewStatus(val as OrderStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {allStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                onClick={handleStatusUpdate}
                disabled={isUpdating || newStatus === order.status}
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </CardContent>
          </Card>

          {/* Payment info */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="capitalize font-medium">
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentIntentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Intent</span>
                  <span className="font-mono text-xs truncate max-w-32">
                    {order.paymentIntentId}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <OrderTimeline currentStatus={order.status} />
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
