'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters, FilterSidebar } from '@/components/products/ProductFilters';
import { useProducts } from '@/hooks/useProducts';
import type { ProductListParams } from '@/lib/types';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: ProductListParams = useMemo(() => ({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sort: (searchParams.get('sort') as ProductListParams['sort']) || 'newest',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  }), [searchParams]);

  const { products, pagination, isLoading } = useProducts(filters);

  const updateFilters = useCallback(
    (newFilters: ProductListParams) => {
      const params = new URLSearchParams();
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.minPrice) params.set('minPrice', String(newFilters.minPrice));
      if (newFilters.maxPrice) params.set('maxPrice', String(newFilters.maxPrice));
      if (newFilters.sort && newFilters.sort !== 'newest') params.set('sort', newFilters.sort);
      if (newFilters.page && newFilters.page > 1) params.set('page', String(newFilters.page));
      const qs = params.toString();
      router.push(qs ? `/products?${qs}` : '/products');
    },
    [router]
  );

  const goToPage = useCallback(
    (page: number) => {
      updateFilters({ ...filters, page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [filters, updateFilters]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl">
          Our Collection
        </h1>
        <p className="mt-2 text-muted-foreground">
          Discover handcrafted furniture designed with natural beauty and built to last.
        </p>
      </div>

      {/* Filters top bar */}
      <div className="mb-8">
        <ProductFilters
          filters={filters}
          onFiltersChange={updateFilters}
          totalResults={pagination?.total}
        />
      </div>

      {/* Main layout: sidebar + grid */}
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-pyra-sand bg-white p-5">
            <FilterSidebar filters={filters} onFiltersChange={updateFilters} />
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            skeletonCount={12}
            className="lg:!grid-cols-3"
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className={
                        pageNum === pagination.page
                          ? 'bg-pyra-forest text-white hover:bg-pyra-forest/90'
                          : ''
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
