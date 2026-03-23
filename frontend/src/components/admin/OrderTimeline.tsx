import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { OrderStatus } from '@/lib/types';

const statusFlow: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  className?: string;
}

export function OrderTimeline({ currentStatus, className }: OrderTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className={cn('space-y-3', className)}>
        <h3 className="text-sm font-medium text-foreground">Order Timeline</h3>
        <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
          <div className="flex size-8 items-center justify-center rounded-full bg-red-500 text-white">
            <span className="text-sm font-bold">X</span>
          </div>
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              Order Cancelled
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = statusFlow.indexOf(currentStatus);

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-medium text-foreground">Order Timeline</h3>
      <div className="space-y-0">
        {statusFlow.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === statusFlow.length - 1;

          return (
            <div key={status} className="flex gap-3">
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    isCompleted
                      ? 'border-pyra-forest bg-pyra-forest text-white'
                      : 'border-border bg-background text-muted-foreground',
                    isCurrent && 'ring-2 ring-pyra-forest/30'
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-3.5" />
                  ) : (
                    <span className="size-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'w-0.5 h-8',
                      index < currentIndex
                        ? 'bg-pyra-forest'
                        : 'bg-border'
                    )}
                  />
                )}
              </div>

              {/* Label */}
              <div className="pb-8">
                <p
                  className={cn(
                    'text-sm font-medium leading-7',
                    isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {statusLabels[status]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
