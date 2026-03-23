import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  processing: {
    label: 'Processing',
    className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <Badge
      variant="secondary"
      className={cn(
        'border-0 font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
