'use client';

import { Paginated } from '@sterenn/api-contracts';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UsePagedQueryOptions<T extends { id: string }, TParams> = {
  pageSize?: number;
  /** Called to load one page; must return `{ results, count }`. */
  fetchPage: (args: {
    page: number;
    take: number;
    params: TParams;
  }) => Promise<Paginated<T>>;
  /**
   * Domain params (search, workspaceId, projectId…).
   * Inline object literals recreate identity every render and will retrigger a reload —
   * memoize with `useMemo` when needed.
   */
  params: TParams;
  /** When false, no fetches run. Default: true */
  enabled?: boolean;
};

export type UsePagedQueryResult<T> = {
  items: T[];
  count: number;
  isLoading: boolean;
  /** True after at least one successful fetch. */
  hasLoaded: boolean;
  hasMore: boolean;
  loadMore: () => void;
  reload: () => void;
};

function serializeParams<T>(params: T): string {
  try {
    return JSON.stringify(params);
  } catch {
    return String(params);
  }
}

/**
 * Shared page + append + id-dedupe + request-race pagination.
 *
 * TODO (later): align WorkspaceContext / ProjectListContext if their
 * cookie / addProject side-effects can stay outside this hook.
 */
export function usePagedQuery<T extends { id: string }, TParams>({
  pageSize = 20,
  fetchPage,
  params,
  enabled = true,
}: UsePagedQueryOptions<T, TParams>): UsePagedQueryResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const requestIdRef = useRef(0);
  const isLoadingRef = useRef(false);
  const pageRef = useRef(0);
  const countRef = useRef(0);
  const itemsLengthRef = useRef(0);
  const fetchPageRef = useRef(fetchPage);
  const paramsRef = useRef(params);

  fetchPageRef.current = fetchPage;
  paramsRef.current = params;

  const paramsKey = serializeParams(params);

  const loadPage = useCallback(
    async (nextPage: number, append: boolean) => {
      if (!enabled) return;
      if (append && isLoadingRef.current) return;

      const requestId = ++requestIdRef.current;
      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        const result = await fetchPageRef.current({
          page: nextPage,
          take: pageSize,
          params: paramsRef.current,
        });

        if (requestId !== requestIdRef.current) return;

        setCount(result.count);
        countRef.current = result.count;
        setItems((current) => {
          const next = append
            ? [
                ...current,
                ...result.results.filter(
                  (item) => !current.some((existing) => existing.id === item.id),
                ),
              ]
            : result.results;
          itemsLengthRef.current = next.length;
          return next;
        });
        pageRef.current = nextPage;
        setHasLoaded(true);
      } finally {
        if (requestId === requestIdRef.current) {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      }
    },
    [enabled, pageSize],
  );

  useEffect(() => {
    if (!enabled) return;

    pageRef.current = 0;
    void loadPage(0, false);
  }, [enabled, paramsKey, loadPage]);

  const loadMore = useCallback(() => {
    if (isLoadingRef.current) return;
    if (itemsLengthRef.current >= countRef.current) return;
    void loadPage(pageRef.current + 1, true);
  }, [loadPage]);

  const reload = useCallback(() => {
    void loadPage(0, false);
  }, [loadPage]);

  return {
    items,
    count,
    isLoading,
    hasLoaded,
    hasMore: items.length < count,
    loadMore,
    reload,
  };
}
