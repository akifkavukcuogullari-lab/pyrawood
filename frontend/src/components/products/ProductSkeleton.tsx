import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden border-pyra-sand bg-pyra-cream/50">
      <div className="relative aspect-square">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-3.5 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
