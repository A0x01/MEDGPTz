/**
 * API Hooks for React Components
 *
 * Custom hooks for data fetching with loading and error states.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiResult<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  reset: () => void;
}

/**
 * Generic hook for API calls with caching
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: unknown[] = [],
  options: { immediate?: boolean; cacheKey?: string } = {}
): UseApiResult<T> {
  const { immediate = true } = options;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      if (mountedRef.current) {
        setState({ data: result, loading: false, error: null });
      }
    } catch (err) {
      if (mountedRef.current) {
        setState({ data: null, loading: false, error: err as Error });
      }
    }
  }, [apiCall]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) {
      execute();
    }
    return () => {
      mountedRef.current = false;
    };
  }, dependencies);

  return {
    ...state,
    refetch: execute,
    reset,
  };
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
): {
  mutate: (variables: TVariables) => Promise<TData>;
  data: TData | null;
  loading: boolean;
  error: Error | null;
  reset: () => void;
} {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (variables: TVariables) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await mutationFn(variables);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      setState({ data: null, loading: false, error: err as Error });
      throw err;
    }
  }, [mutationFn]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

/**
 * Hook for paginated data
 */
export function usePaginatedApi<T>(
  apiCall: (page: number, pageSize: number) => Promise<{
    items: T[];
    total: number;
    page: number;
    page_size: number;
    pages: number;
  }>,
  initialPageSize = 20
): {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refetch: () => Promise<void>;
} {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [state, setState] = useState<{
    items: T[];
    total: number;
    totalPages: number;
    loading: boolean;
    error: Error | null;
  }>({
    items: [],
    total: 0,
    totalPages: 0,
    loading: true,
    error: null,
  });

  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall(page, pageSize);
      if (mountedRef.current) {
        setState({
          items: result.items,
          total: result.total,
          totalPages: result.pages,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err as Error,
        }));
      }
    }
  }, [apiCall, page, pageSize]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return {
    ...state,
    page,
    pageSize,
    setPage,
    setPageSize,
    refetch: fetchData,
  };
}
