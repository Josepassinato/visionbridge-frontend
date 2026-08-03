'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { apiClient, HealthResponse, TenantListResponse } from './api-client';

interface PollingOptions {
  interval?: number;
  enabled?: boolean;
  onError?: (error: any) => void;
  retryOnError?: boolean;
  maxRetries?: number;
}

interface PollingState<T> {
  data: T | null;
  loading: boolean;
  error: any | null;
  lastUpdated: Date | null;
}

export function useAdminPolling<T>(
  fetcher: () => Promise<T>,
  options: PollingOptions = {}
) {
  const {
    interval = 5000,
    enabled = true,
    onError,
    retryOnError = true,
    maxRetries = 3,
  } = options;

  const [state, setState] = useState<PollingState<T>>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const retryCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetcher();
      setState({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
      retryCountRef.current = 0;
    } catch (error) {
      console.error('Polling error:', error);
      retryCountRef.current += 1;

      if (retryOnError && retryCountRef.current < maxRetries) {
        setTimeout(() => fetchData(), interval * Math.pow(2, retryCountRef.current - 1));
      } else {
        setState((prev) => ({
          ...prev,
          error,
          loading: false,
        }));
        onError?.(error);
      }
    }
  }, [fetcher, interval, retryOnError, maxRetries, onError]);

  useEffect(() => {
    if (!enabled) return;

    fetchData();
    intervalRef.current = setInterval(fetchData, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, interval, fetchData]);

  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}

export function useHealthPolling(interval: number = 5000) {
  return useAdminPolling<HealthResponse>(
    () => apiClient.verifyHealth(),
    { interval }
  );
}

export function useTenantsPolling(page: number = 1, interval: number = 10000) {
  return useAdminPolling<TenantListResponse>(
    () => apiClient.listTenants(page),
    { interval }
  );
}
