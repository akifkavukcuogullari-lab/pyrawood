'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { apiGetPaginated } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order, OrderStatus } from '@/lib/types';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';

const statusTabs: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await apiGetPaginated<Order>(ENDPOINTS.ADMIN.ORDERS.LIST, {
          limit: 200,
        });
        setOrders(res.data ?? []);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to load orders'
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (order) => (
        <span className="font-mono text-xs">#{order.id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (order) => (
        <span className="text-sm">
          {order.user?.name ?? order.shippingAddress.fullName}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (order) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(order.createdAt)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order) => <OrderStatusBadge status={order.status} />,
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (order) => (
        <span className="font-medium">{formatCurrency(order.total)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      render: (order) => (
        <Button variant="ghost" size="icon-xs" render={<Link href={`/admin/orders/${order.id}`} />}>
          <Eye className="size-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-semibold text-foreground">
          Orders
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage customer orders
        </p>
      </div>

      <Tabs
        value={statusFilter}
        onValueChange={setStatusFilter}
      >
        <TabsList variant="line">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {tab.value !== 'all' && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({orders.filter((o) =>
                    tab.value === 'all' ? true : o.status === tab.value
                  ).length})
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <DataTable
        columns={columns}
        data={filteredOrders}
        isLoading={isLoading}
        searchPlaceholder="Search by order ID or customer..."
        searchFn={(order, query) =>
          order.id.toLowerCase().includes(query) ||
          (order.user?.name ?? order.shippingAddress.fullName)
            .toLowerCase()
            .includes(query)
        }
        emptyMessage="No orders found."
      />
    </div>
  );
}
