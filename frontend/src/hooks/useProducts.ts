'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGetPaginated, apiGet } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import type { Product, ProductListParams, PaginatedResponse } from '@/lib/types';

export function useProducts(params: ProductListParams = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Product>['pagination'] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serializedParams = JSON.stringify(params);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const parsed = JSON.parse(serializedParams) as ProductListParams;
      const res = await apiGetPaginated<Product>(
        ENDPOINTS.PRODUCTS.LIST,
        parsed as unknown as Record<string, unknown>
      );
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [serializedParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, pagination, isLoading, error, refetch: fetchProducts };
}

export function useProduct(idOrSlug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) return;

    let cancelled = false;

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiGet<Product>(ENDPOINTS.PRODUCTS.DETAIL(idOrSlug));
        if (!cancelled && res.data) {
          setProduct(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load product');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [idOrSlug]);

  return { product, isLoading, error };
}
