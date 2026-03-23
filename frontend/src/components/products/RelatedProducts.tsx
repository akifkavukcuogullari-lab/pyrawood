'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ProductSkeleton } from '@/components/products/ProductSkeleton';
import type { Product } from '@/lib/types';

interface RelatedProductsProps {
  product: Product;
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products, isLoading } = useProducts({
    category: product.category?.slug,
    limit: 8,
  });

  // Exclude current product
  const related = products.filter((p) => p.id !== product.id);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
          You May Also Like
        </h2>
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => scroll('left')}
            className="rounded-full"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => scroll('right')}
            className="rounded-full"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="-mx-4 flex gap-6 overflow-x-auto px-4 pb-4 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="w-[280px] flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                <ProductSkeleton />
              </div>
            ))
          : related.map((p) => (
              <div key={p.id} className="w-[280px] flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={p} />
              </div>
            ))}
      </div>
    </section>
  );
}
