'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { AdminStats } from '@/lib/types';
import { StatsCards } from '@/components/admin/StatsCards';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, ShoppingCart, Plus, Eye } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiGet<AdminStats>(ENDPOINTS.ADMIN.STATS);
        if (res.data) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-semibold text-foreground">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your store performance
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats cards */}
      <StatsCards
        totalRevenue={stats?.totalRevenue}
        totalOrders={stats?.totalOrders}
        totalUsers={stats?.totalUsers}
        totalProducts={stats?.totalProducts}
        isLoading={isLoading}
      />

      {/* Revenue chart */}
      <RevenueChart
        data={stats?.revenueByMonth ?? []}
        isLoading={isLoading}
      />

      {/* Quick actions + Recent orders */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-playfair text-lg">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" render={<Link href="/admin/products/new" />}>
              <Plus className="size-4 mr-2" />
              Add New Product
            </Button>
            <Button variant="outline" className="w-full justify-start" render={<Link href="/admin/products" />}>
              <Package className="size-4 mr-2" />
              Manage Products
            </Button>
            <Button variant="outline" className="w-full justify-start" render={<Link href="/admin/orders" />}>
              <ShoppingCart className="size-4 mr-2" />
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-playfair text-lg">
              Recent Orders
            </CardTitle>
            <Button variant="ghost" size="sm" render={<Link href="/admin/orders" />}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentOrders.slice(0, 10).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-xs">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.user?.name ?? order.shippingAddress.fullName}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-xs" render={<Link href={`/admin/orders/${order.id}`} />}>
                          <Eye className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No recent orders
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
