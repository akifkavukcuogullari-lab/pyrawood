'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiGetPaginated } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import type { Order } from '@/lib/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiGetPaginated<Order>(ENDPOINTS.ORDERS.LIST);
      setOrders(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchOrder() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiGet<Order>(ENDPOINTS.ORDERS.DETAIL(id));
        if (!cancelled && res.data) {
          setOrder(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load order');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { order, isLoading, error };
}
