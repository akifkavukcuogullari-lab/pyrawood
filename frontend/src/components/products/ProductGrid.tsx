'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductSkeleton } from '@/components/products/ProductSkeleton';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  className,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className || ''}`}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="rounded-full bg-pyra-sand p-6">
          <svg className="size-12 text-pyra-walnut/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <h3 className="font-heading text-xl text-pyra-walnut">No products found</h3>
        <p className="max-w-sm text-muted-foreground">
          Try adjusting your filters or search terms to find what you are looking for.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
