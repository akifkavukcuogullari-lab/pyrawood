'use client';

import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/reviews/StarRating';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductInfoProps {
  product: Product;
  onScrollToReviews?: () => void;
}

export function ProductInfo({ product, onScrollToReviews }: ProductInfoProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const stockStatus =
    product.stock === 0
      ? { label: 'Out of Stock', color: 'bg-red-100 text-red-700' }
      : product.stock <= 5
        ? { label: `Low Stock - Only ${product.stock} left`, color: 'bg-amber-100 text-amber-700' }
        : { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700' };

  return (
    <div className="space-y-5">
      {/* Category */}
      {product.category && (
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {product.category.name}
        </p>
      )}

      {/* Name */}
      <h1 className="font-heading text-3xl font-bold tracking-tight text-pyra-walnut sm:text-4xl">
        {product.name}
      </h1>

      {/* Rating */}
      {(product.averageRating ?? 0) > 0 && (
        <div className="flex items-center gap-2">
          <StarRating rating={product.averageRating || 0} size="md" showValue />
          {product.reviewCount !== undefined && product.reviewCount > 0 && (
            <button
              onClick={onScrollToReviews}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}
            </button>
          )}
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-pyra-walnut">
          {formatCurrency(product.price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatCurrency(product.compareAtPrice!)}
            </span>
            <Badge className="bg-pyra-gold text-white">Save {discountPercent}%</Badge>
          </>
        )}
      </div>

      {/* Stock */}
      <div>
        <Badge variant="secondary" className={stockStatus.color}>
          {stockStatus.label}
        </Badge>
      </div>

      {/* Description */}
      {product.description && (
        <div className="prose prose-sm max-w-none text-pyra-charcoal/80">
          <p>{product.description}</p>
        </div>
      )}

      {/* SKU */}
      {product.sku && (
        <p className="text-xs text-muted-foreground">
          SKU: {product.sku}
        </p>
      )}
    </div>
  );
}
