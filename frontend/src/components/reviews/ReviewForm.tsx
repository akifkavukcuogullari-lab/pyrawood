'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { apiPost } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { CreateReviewRequest, Review } from '@/lib/types';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: (review: Review) => void;
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<CreateReviewRequest, 'rating'>>({
    defaultValues: { title: '', body: '' },
  });

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-pyra-sand bg-pyra-cream/50 p-6 text-center">
        <p className="text-muted-foreground">
          Please{' '}
          <a href="/login" className="font-medium text-pyra-forest underline-offset-4 hover:underline">
            sign in
          </a>{' '}
          to leave a review.
        </p>
      </div>
    );
  }

  const onSubmit = async (data: Omit<CreateReviewRequest, 'rating'>) => {
    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiPost<Review>(ENDPOINTS.REVIEWS.CREATE(productId), {
        ...data,
        rating: selectedRating,
      });
      toast.success('Review submitted successfully');
      reset();
      setSelectedRating(0);
      if (onReviewSubmitted && res.data) {
        onReviewSubmitted(res.data);
      }
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-lg border border-pyra-sand bg-white p-6">
      <h3 className="font-heading text-lg font-semibold text-pyra-walnut">Write a Review</h3>

      {/* Star selector */}
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setSelectedRating(star)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  'size-6 transition-colors',
                  (hoveredStar || selectedRating) >= star
                    ? 'fill-pyra-gold text-pyra-gold'
                    : 'text-pyra-sand'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="review-title">Title (optional)</Label>
        <Input
          id="review-title"
          placeholder="Summarize your experience"
          className="bg-white"
          {...register('title')}
        />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <Label htmlFor="review-body">Review</Label>
        <Textarea
          id="review-body"
          placeholder="Share your thoughts about this product..."
          className="min-h-[100px] bg-white"
          {...register('body', { required: 'Please write a review' })}
        />
        {errors.body && (
          <p className="text-xs text-red-500">{errors.body.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-pyra-forest text-white hover:bg-pyra-forest/90"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
