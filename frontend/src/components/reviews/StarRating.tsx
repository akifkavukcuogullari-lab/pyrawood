'use client';

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
};

export function StarRating({ rating, size = 'md', showValue = false, className }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const adjustedFull = rating - fullStars >= 0.75 ? fullStars + 1 : fullStars;
  const emptyStars = 5 - adjustedFull - (hasHalf ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: adjustedFull }, (_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(sizeMap[size], 'fill-pyra-gold text-pyra-gold')}
        />
      ))}
      {hasHalf && (
        <div className="relative">
          <Star className={cn(sizeMap[size], 'text-pyra-gold')} />
          <StarHalf
            className={cn(sizeMap[size], 'absolute inset-0 fill-pyra-gold text-pyra-gold')}
          />
        </div>
      )}
      {Array.from({ length: Math.max(0, emptyStars) }, (_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(sizeMap[size], 'text-pyra-sand')}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
