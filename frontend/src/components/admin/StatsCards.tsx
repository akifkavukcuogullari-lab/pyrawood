'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
} from 'lucide-react';

interface StatsCardsProps {
  totalRevenue?: number;
  totalOrders?: number;
  totalUsers?: number;
  totalProducts?: number;
  isLoading?: boolean;
}

const stats = [
  {
    key: 'totalRevenue' as const,
    title: 'Total Revenue',
    icon: DollarSign,
    format: (v: number) => formatCurrency(v),
    color: 'text-pyra-forest',
    bgColor: 'bg-pyra-forest/10',
  },
  {
    key: 'totalOrders' as const,
    title: 'Total Orders',
    icon: ShoppingCart,
    format: (v: number) => v.toLocaleString(),
    color: 'text-pyra-walnut',
    bgColor: 'bg-pyra-walnut/10',
  },
  {
    key: 'totalUsers' as const,
    title: 'Total Customers',
    icon: Users,
    format: (v: number) => v.toLocaleString(),
    color: 'text-pyra-gold',
    bgColor: 'bg-pyra-gold/10',
  },
  {
    key: 'totalProducts' as const,
    title: 'Total Products',
    icon: Package,
    format: (v: number) => v.toLocaleString(),
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10',
  },
];

export function StatsCards({
  totalRevenue = 0,
  totalOrders = 0,
  totalUsers = 0,
  totalProducts = 0,
  isLoading = false,
}: StatsCardsProps) {
  const values = { totalRevenue, totalOrders, totalUsers, totalProducts };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.key} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        const value = values[s.key];
        return (
          <Card key={s.key} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-10 items-center justify-center rounded-lg ${s.bgColor}`}
                >
                  <Icon className={`size-5 ${s.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{s.title}</p>
                  <p className="text-xl font-semibold text-foreground truncate">
                    {s.format(value)}
                  </p>
                </div>
                <TrendingUp className="size-4 text-pyra-forest/50" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
