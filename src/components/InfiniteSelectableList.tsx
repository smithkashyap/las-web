import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectableItem, type SelectableItemData } from './SelectableItem';
import type { PaginatedListDataSource, UINode } from '../renderer/types';
import { resolveNodeStyle, theme } from '../renderer/styles';
import { useUIState } from '../state/uiState';
import { apiClient } from '../sdk/initSDK';
import InlineSpinner from './InlineSpinner';

interface InfiniteSelectableListProps {
  selectionKey: string;
  items?: SelectableItemData[];
  itemsPerPage?: number;
  emptyTitle?: string;
  emptySubtitle?: string;
  dataSource?: PaginatedListDataSource;
}

interface CacheEntry {
  items: SelectableItemData[];
  page: number;
  totalPages: number;
}

// ── Helpers ──

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPathValue(source: unknown, path: string | undefined): unknown {
  if (!path) return undefined;
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
}

function getStateValue(key: string, state: ReturnType<typeof useUIState>['state']): unknown {
  if (key in state.values) return state.values[key];
  if (key in state.selections) return state.selections[key];
  return undefined;
}

function resolveTemplateString(value: string, state: ReturnType<typeof useUIState>['state']): unknown {
  const exactMatch = value.match(/^\{\{(\w+)\}\}$/);
  if (exactMatch?.[1]) return getStateValue(exactMatch[1], state) ?? '';
  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => String(getStateValue(key, state) ?? ''));
}

function resolveQueryValue(value: unknown, state: ReturnType<typeof useUIState>['state']): unknown {
  if (typeof value === 'string') return resolveTemplateString(value, state);
  if (Array.isArray(value)) return value.map((item) => resolveQueryValue(item, state));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, resolveQueryValue(v, state)]),
    );
  }
  return value;
}

// ── Component ──

export function InfiniteSelectableList({ node }: { node: UINode }) {
  const props = (node.props ?? {}) as unknown as InfiniteSelectableListProps;
  const { state, isSelected, toggleSelection, setValue, setSelections } = useUIState();

  const selectionKey = props.selectionKey;
  const itemsPerPage = Math.max(1, props.itemsPerPage ?? 10);
  const hasDataSource = Boolean(props.dataSource);

  const resolvedQuery = props.dataSource?.query
    ? (resolveQueryValue(props.dataSource.query, state) as Record<string, unknown>)
    : {};
  const queryKey = JSON.stringify(resolvedQuery);
  const cacheKey = `infinite-list:${selectionKey}:${queryKey}`;

  const [loadedItems, setLoadedItems] = useState<SelectableItemData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevQueryKeyRef = useRef(queryKey);
  const hasInitializedSelection = useRef(false);
  const cacheRestoredRef = useRef(false);

  // Store itemMap in UIState whenever loaded items change
  useEffect(() => {
    if (loadedItems.length === 0) return;
    const map: Record<string, { eligibleAmount: number; loanAmount: number }> = {};
    for (const item of loadedItems) {
      map[item.value] = {
        eligibleAmount: item.eligibleAmount ?? 0,
        loanAmount: item.loanAmount ?? 0,
      };
    }
    setValue(`${selectionKey}ItemMap`, JSON.stringify(map));

    // Auto-select all non-disabled items on first load
    if (!hasInitializedSelection.current) {
      hasInitializedSelection.current = true;
      const defaultSelected = loadedItems.filter((i) => !i.disabled).map((i) => i.value);
      setSelections(selectionKey, defaultSelected);
    }
  }, [loadedItems, selectionKey, setValue, setSelections]);

  // Reset when query changes + clear cache
  useEffect(() => {
    if (prevQueryKeyRef.current !== queryKey) {
      prevQueryKeyRef.current = queryKey;
      setLoadedItems([]);
      setCurrentPage(1);
      setTotalPages(1);
      cacheRestoredRef.current = false;
      hasInitializedSelection.current = false;
      try { sessionStorage.removeItem(cacheKey); } catch { /* noop */ }
    }
  }, [queryKey, cacheKey]);

  // Static items mode
  useEffect(() => {
    if (hasDataSource) return;
    const staticItems = props.items ?? [];
    const total = Math.max(1, Math.ceil(staticItems.length / itemsPerPage));
    const end = currentPage * itemsPerPage;
    setLoadedItems(staticItems.slice(0, end));
    setTotalPages(total);
  }, [hasDataSource, props.items, currentPage, itemsPerPage]);

  // DataSource fetch (with cache + mock delay)
  useEffect(() => {
    if (!props.dataSource) return;

    // Try restoring from cache on mount
    if (!cacheRestoredRef.current) {
      cacheRestoredRef.current = true;
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as CacheEntry;
          if (parsed.items?.length > 0) {
            setLoadedItems(parsed.items);
            setCurrentPage(parsed.page);
            setTotalPages(parsed.totalPages);
            return; // skip fetch
          }
        }
      } catch { /* ignore parse errors */ }
    }

    let cancelled = false;
    const ds = props.dataSource;
    const isJsonMode = ds.type === 'json';
    const isFirstPage = currentPage === 1;

    if (isFirstPage) setIsLoading(true);
    else setIsLoadingMore(true);
    setErrorMessage('');

    if (isJsonMode) {
      const path = ds.api;
      fetch(path)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load ${path}`);
          return res.json() as Promise<Record<string, unknown[]>>;
        })
        .then(async (data) => {
          // Apply mock delay
          const delayMs = ds.mockDelayMs ?? 0;
          if (delayMs > 0) {
            await delay(delayMs);
          }
          if (cancelled) return;

          const keyParam = ds.queryKey ?? 'type';
          const keyValue = String((resolvedQuery as Record<string, unknown>)[keyParam] ?? Object.keys(data)[0] ?? '');
          const allItems = (data[keyValue] ?? []) as unknown as SelectableItemData[];

          const totalItems = allItems.length;
          const pages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
          const end = currentPage * itemsPerPage;
          const sliced = allItems.slice(0, end);

          setLoadedItems(sliced);
          setTotalPages(pages);

          // Save to cache
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ items: sliced, page: currentPage, totalPages: pages }));
          } catch { /* storage full */ }
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load data.');
        })
        .finally(() => {
          if (!cancelled) { setIsLoading(false); setIsLoadingMore(false); }
        });
    } else {
      // API mode
      const query: Record<string, string | number | boolean | undefined> = {};
      if (resolvedQuery && typeof resolvedQuery === 'object') {
        for (const [key, value] of Object.entries(resolvedQuery)) {
          if (value !== undefined && value !== null && value !== '') {
            query[key] = typeof value === 'object' ? JSON.stringify(value) : (value as string | number | boolean);
          }
        }
      }
      query.page = currentPage;
      query.limit = itemsPerPage;

      const apiPath = ds.api;
      const request = (ds.method ?? 'GET') === 'POST'
        ? apiClient.post<unknown, Record<string, unknown>>(apiPath, query)
        : apiClient.get<unknown>(apiPath, { query });

      request
        .then((response) => {
          if (cancelled) return;
          const responseMap = ds.responseMap;
          const mappedItems = getPathValue(response, responseMap?.items ?? 'data.items');
          const mappedTotalPages = getPathValue(response, responseMap?.totalPages ?? 'data.totalPages');

          const newItems = Array.isArray(mappedItems) ? (mappedItems as unknown as SelectableItemData[]) : [];
          const pages = typeof mappedTotalPages === 'number' ? mappedTotalPages : 1;

          const updatedItems = isFirstPage ? newItems : [...loadedItems, ...newItems];
          setLoadedItems(updatedItems);
          setTotalPages(Math.max(1, pages));

          // Save to cache
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ items: updatedItems, page: currentPage, totalPages: Math.max(1, pages) }));
          } catch { /* storage full */ }
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load data.');
        })
        .finally(() => {
          if (!cancelled) { setIsLoading(false); setIsLoadingMore(false); }
        });
    }

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, hasDataSource, itemsPerPage, props.dataSource?.api, props.dataSource?.type, props.dataSource?.method, queryKey]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isLoading || isLoadingMore) return;
    if (currentPage >= totalPages) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setCurrentPage((p) => p + 1);
    }
  }, [isLoading, isLoadingMore, currentPage, totalPages]);

  const isEmpty = !isLoading && loadedItems.length === 0;

  const resolvedStyle = resolveNodeStyle(node, 'container', {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    gap: '12px',
  });

  return (
    <div style={resolvedStyle}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto', gap: '12px' }}
      >
        {isLoading ? (
          <InlineSpinner />
        ) : errorMessage ? (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ margin: 0, color: theme.textPrimary, fontSize: '16px', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Unable to load data</p>
              <p style={{ margin: 0, color: theme.textSecondary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{errorMessage}</p>
            </div>
          </div>
        ) : isEmpty ? (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ margin: 0, color: theme.textPrimary, fontSize: '16px', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{props.emptyTitle ?? 'No data available'}</p>
              <p style={{ margin: 0, color: theme.textSecondary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{props.emptySubtitle ?? 'Please try again later'}</p>
            </div>
          </div>
        ) : (
          <>
            {loadedItems.map((item) => (
              <SelectableItem
                key={item.value}
                {...item}
                checked={isSelected(selectionKey, item.value)}
                onClick={item.disabled ? () => {} : () => toggleSelection(selectionKey, item.value)}
              />
            ))}
            {isLoadingMore && (
              <p style={{ margin: 0, textAlign: 'center', color: theme.textSecondary, fontSize: '13px', padding: '8px 0', fontFamily: "'Inter', sans-serif" }}>
                Loading more...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
