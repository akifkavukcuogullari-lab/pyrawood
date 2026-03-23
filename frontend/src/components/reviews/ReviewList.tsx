'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StarRating } from '@/components/reviews/StarRating';
import { apiGetPaginated } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import { formatDate, getInitials } from '@/lib/utils';
import type { Review, PaginatedResponse } from '@/lib/types';

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Review>['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiGetPaginated<Review>(ENDPOINTS.REVIEWS.LIST(productId), {
        page,
        limit: 5,
      });
      setReviews(res.data);
      setPagination(res.pagination);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [productId, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <article key={review.id} className="space-y-3 rounded-lg border border-pyra-sand bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={review.user?.avatarUrl} alt={review.user?.name || 'Reviewer'} />
                <AvatarFallback className="bg-pyra-sand text-pyra-walnut text-xs">
                  {review.user?.name ? getInitials(review.user.name) : '??'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-pyra-charcoal">
                  {review.user?.name || 'Anonymous'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
          {review.title && (
            <h4 className="font-medium text-pyra-charcoal">{review.title}</h4>
          )}
          {review.body && (
            <p className="text-sm leading-relaxed text-pyra-charcoal/80">{review.body}</p>
          )}
        </article>
      ))}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
