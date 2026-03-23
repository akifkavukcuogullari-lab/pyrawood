'use client';

import { use, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts } from '@/hooks/useProducts';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { PYRA_WOOD_CATEGORIES } from '@/lib/constants';
import type { ProductListParams } from '@/lib/types';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'rating', label: 'Top Rated' },
] as const;

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryInfo = PYRA_WOOD_CATEGORIES.find((c) => c.slug === slug);

  const filters: ProductListParams = useMemo(() => ({
    category: slug,
    sort: (searchParams.get('sort') as ProductListParams['sort']) || 'newest',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  }), [slug, searchParams]);

  const { products, pagination, isLoading } = useProducts(filters);

  const updateSort = useCallback(
    (sort: string | null) => {
      if (!sort) return;
      const params = new URLSearchParams();
      if (sort && sort !== 'newest') params.set('sort', sort);
      const qs = params.toString();
      router.push(qs ? `/categories/${slug}?${qs}` : `/categories/${slug}`);
    },
    [router, slug]
  );

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page > 1) {
        params.set('page', String(page));
      } else {
        params.delete('page');
      }
      const qs = params.toString();
      router.push(qs ? `/categories/${slug}?${qs}` : `/categories/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [router, slug, searchParams]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: categoryInfo?.name || slug, url: `/categories/${slug}` },
        ]}
      />

      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-pyra-walnut">Home</Link>
          </li>
          <ChevronRight className="size-3.5" />
          <li>
            <Link href="/products" className="hover:text-pyra-walnut">Products</Link>
          </li>
          <ChevronRight className="size-3.5" />
          <li className="font-medium text-pyra-charcoal">
            {categoryInfo?.name || slug}
          </li>
        </ol>
      </nav>

      {/* Category header */}
      <header className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-pyra-walnut to-pyra-walnut/80 px-8 py-12 text-center sm:py-16">
          <h1 className="font-heading text-3xl font-bold text-pyra-cream sm:text-4xl md:text-5xl">
            {categoryInfo?.name || slug}
          </h1>
          {categoryInfo?.description && (
            <p className="mx-auto mt-3 max-w-xl text-pyra-cream/80">
              {categoryInfo.description}
            </p>
          )}
        </div>
      </header>

      {/* Sort + Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {pagination?.total ?? 0} {(pagination?.total ?? 0) === 1 ? 'product' : 'products'}
          </p>
          <Select
            value={filters.sort || 'newest'}
            onValueChange={updateSort}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products */}
        <ProductGrid products={products} isLoading={isLoading} skeletonCount={12} />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2 pb-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <span className="px-3 text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
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
    </motion.div>
  );
}
