'use client';

import { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PYRA_WOOD_CATEGORIES } from '@/lib/constants';
import type { ProductListParams } from '@/lib/types';

interface ProductFiltersProps {
  filters: ProductListParams;
  onFiltersChange: (filters: ProductListParams) => void;
  totalResults?: number;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'rating', label: 'Top Rated' },
] as const;

function FilterSidebar({
  filters,
  onFiltersChange,
}: Pick<ProductFiltersProps, 'filters' | 'onFiltersChange'>) {
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice ?? 0,
    filters.maxPrice ?? 10000,
  ]);

  useEffect(() => {
    setPriceRange([filters.minPrice ?? 0, filters.maxPrice ?? 10000]);
  }, [filters.minPrice, filters.maxPrice]);

  const handleCategoryToggle = useCallback(
    (slug: string) => {
      const current = filters.category;
      if (current === slug) {
        onFiltersChange({ ...filters, category: undefined, page: 1 });
      } else {
        onFiltersChange({ ...filters, category: slug, page: 1 });
      }
    },
    [filters, onFiltersChange]
  );

  const handlePriceCommit = useCallback(
    (values: number[]) => {
      onFiltersChange({
        ...filters,
        minPrice: values[0] > 0 ? values[0] : undefined,
        maxPrice: values[1] < 10000 ? values[1] : undefined,
        page: 1,
      });
    },
    [filters, onFiltersChange]
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({ page: 1, limit: filters.limit });
  }, [filters.limit, onFiltersChange]);

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.search;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-pyra-walnut">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="size-3.5" />
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-pyra-charcoal">Category</h4>
        <div className="space-y-2">
          {PYRA_WOOD_CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1 text-sm transition-colors hover:bg-pyra-sand/50"
            >
              <Checkbox
                checked={filters.category === cat.slug}
                onCheckedChange={() => handleCategoryToggle(cat.slug)}
              />
              <span className="text-pyra-charcoal">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-pyra-charcoal">Price Range</h4>
        <Slider
          value={priceRange}
          min={0}
          max={10000}
          onValueChange={(values) => setPriceRange(Array.isArray(values) ? values : [values])}
          onValueCommitted={(values) => handlePriceCommit(Array.isArray(values) ? values : [values])}
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0].toLocaleString()}</span>
          <span>${priceRange[1].toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export function ProductFilters({
  filters,
  onFiltersChange,
  totalResults,
}: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top bar: search, sort, mobile filter trigger */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Input
            placeholder="Search products..."
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value || undefined, page: 1 })
            }
            className="bg-white pl-3"
          />
        </div>

        <Select
          value={filters.sort || 'newest'}
          onValueChange={(val) =>
            onFiltersChange({
              ...filters,
              sort: val as ProductListParams['sort'],
              page: 1,
            })
          }
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

        {/* Mobile filter button */}
        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" size="default">
                  <SlidersHorizontal className="size-4" />
                  Filters
                </Button>
              }
            />
            <SheetContent side="left" className="w-[300px] overflow-y-auto p-6">
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar filters={filters} onFiltersChange={(f) => { onFiltersChange(f); setMobileOpen(false); }} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {totalResults !== undefined && (
          <p className="w-full text-sm text-muted-foreground sm:w-auto">
            {totalResults} {totalResults === 1 ? 'product' : 'products'} found
          </p>
        )}
      </div>

      {/* Desktop sidebar content (rendered by parent layout) */}
    </>
  );
}

export { FilterSidebar };
