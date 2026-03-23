'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/reviews/StarRating';
import { useCartStore } from '@/store/cart-store';
import { cn, formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId: product.id, quantity: 1 });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <Card className="group overflow-hidden border-pyra-sand bg-pyra-cream/50 transition-shadow duration-300 hover:shadow-lg">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={primaryImage?.url || '/images/placeholder.jpg'}
              alt={primaryImage?.altText || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {hasDiscount && (
              <Badge className="absolute top-3 left-3 bg-pyra-gold text-white">
                -{discountPercent}%
              </Badge>
            )}
            {product.category && (
              <Badge
                variant="secondary"
                className="absolute top-3 right-3 bg-white/90 text-pyra-charcoal backdrop-blur-sm"
              >
                {product.category.name}
              </Badge>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="font-heading text-lg font-semibold text-white">
                  Out of Stock
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/30 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
              <Button
                size="sm"
                className="w-full bg-pyra-forest text-white hover:bg-pyra-forest/90"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="size-4" />
                Add to Cart
              </Button>
            </div>
          </div>
          <CardContent className="space-y-2 p-4">
            {product.category && (
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.category.name}
              </p>
            )}
            <h3 className="font-heading text-lg leading-snug text-pyra-charcoal line-clamp-1">
              {product.name}
            </h3>
            {(product.averageRating ?? 0) > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating rating={product.averageRating || 0} size="sm" />
                {product.reviewCount !== undefined && product.reviewCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className={cn(
                'font-semibold text-pyra-walnut',
                hasDiscount && 'text-pyra-gold'
              )}>
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.compareAtPrice!)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
