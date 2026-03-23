'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading = false }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair text-lg">
            <BarChart3 className="size-5 text-pyra-gold" />
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-64">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-playfair text-lg">
          <BarChart3 className="size-5 text-pyra-gold" />
          Monthly Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-muted-foreground w-16">
            <span>{formatCurrency(maxRevenue)}</span>
            <span>{formatCurrency(maxRevenue / 2)}</span>
            <span>$0</span>
          </div>

          {/* Chart area */}
          <div className="ml-18 flex items-end gap-1.5 h-64">
            {data.map((d, i) => {
              const heightPercent = maxRevenue > 0
                ? (d.revenue / maxRevenue) * 100
                : 0;

              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-1 relative"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {hoveredIndex === i && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 rounded-md bg-pyra-charcoal px-2.5 py-1.5 text-xs text-white whitespace-nowrap shadow-lg">
                      {formatCurrency(d.revenue)}
                    </div>
                  )}

                  {/* Bar */}
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-sm transition-all duration-200"
                      style={{
                        height: `${Math.max(heightPercent, 2)}%`,
                        backgroundColor:
                          hoveredIndex === i
                            ? 'var(--pyra-gold)'
                            : 'var(--pyra-forest)',
                      }}
                    />
                  </div>

                  {/* Month label */}
                  <span className="text-[10px] text-muted-foreground leading-none truncate w-full text-center">
                    {d.month.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
