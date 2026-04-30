import { useEffect, useState, useRef } from 'react';
import { DynamicRenderer } from '../renderer/DynamicRenderer';
import type { PaginatedListDataSource, UINode } from '../renderer/types';
import { resolveNodeStyle, theme } from '../renderer/styles';
import { useUIState } from '../state/uiState';
import { apiClient } from '../sdk/initSDK';
import { Spinner } from './Spinner';
import InlineSpinner from './InlineSpinner';

interface PaginatedListProps {
  itemType: string;
  items?: Record<string, unknown>[];
  extraProps?: Record<string, unknown>;
  itemsPerPage?: number;
  emptyTitle?: string;
  emptySubtitle?: string;
  dataSource?: PaginatedListDataSource;
}

interface ServerPageState {
  items: Record<string, unknown>[];
  page: number;
  totalPages: number;
  totalItems: number;
}

// ── Helpers ──

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

function renderEmptyState(title: string, subtitle: string) {
  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px' }}>
        <p style={{ margin: 0, color: theme.textPrimary, fontSize: '16px', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{title}</p>
        <p style={{ margin: 0, color: theme.textSecondary, fontSize: '14px', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{subtitle}</p>
      </div>
    </div>
  );
}


// ── Component ──

export function PaginatedList({ node }: { node: UINode }) {
  const props = (node.props ?? {}) as unknown as PaginatedListProps;
  const { state } = useUIState();

  const staticItems = props.items ?? [];
  const itemsPerPage = Math.max(1, props.itemsPerPage ?? 5);
  const hasDataSource = Boolean(props.dataSource);
  const staticTotalPages = Math.max(1, Math.ceil(staticItems.length / itemsPerPage));

  const resolvedQuery = props.dataSource?.query
    ? (resolveQueryValue(props.dataSource.query, state) as Record<string, unknown>)
    : {};
  const queryKey = JSON.stringify(resolvedQuery);

  const [currentPage, setCurrentPage] = useState(1);
  const [serverState, setServerState] = useState<ServerPageState>({ items: [], page: 1, totalPages: 1, totalItems: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset page when query changes
  const prevQueryKeyRef = useRef(queryKey);
  useEffect(() => {
    if (prevQueryKeyRef.current !== queryKey) {
      prevQueryKeyRef.current = queryKey;
      setCurrentPage(1);
    }
  }, [queryKey]);

  // Clamp static page
  useEffect(() => {
    if (!hasDataSource) {
      setCurrentPage((p) => Math.min(p, staticTotalPages));
    }
  }, [hasDataSource, staticTotalPages]);

  // ── Data fetching (JSON file or API) ──
  useEffect(() => {
    if (!props.dataSource) return;

    let cancelled = false;
    const ds = props.dataSource;
    const isJsonMode = ds.type === 'json';

    setIsLoading(true);
    setErrorMessage('');

    if (isJsonMode) {
      // ── JSON file mode: fetch static file, pick key, slice ──
      fetch(ds.api)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load ${ds.api}`);
          return res.json() as Promise<Record<string, unknown[]>>;
        })
        .then((data) => {
          if (cancelled) return;

          // Resolve which key to pick from the JSON object
          const keyParam = ds.queryKey ?? 'type';
          const keyValue = String((resolvedQuery as Record<string, unknown>)[keyParam] ?? Object.keys(data)[0] ?? '');
          const allItems = (data[keyValue] ?? []) as Record<string, unknown>[];

          const totalItems = allItems.length;
          const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
          const clampedPage = Math.min(currentPage, totalPages);
          const start = (clampedPage - 1) * itemsPerPage;
          const items = allItems.slice(start, start + itemsPerPage);

          setServerState({ items, page: clampedPage, totalPages, totalItems });
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          setServerState({ items: [], page: 1, totalPages: 1, totalItems: 0 });
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load data.');
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    } else {
      // ── API mode: call backend via SDK httpClient ──
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
          const mappedPage = getPathValue(response, responseMap?.page ?? 'data.page');
          const mappedTotalPages = getPathValue(response, responseMap?.totalPages ?? 'data.totalPages');
          const mappedTotalItems = getPathValue(response, responseMap?.totalItems ?? 'data.totalItems');

          const nextItems = Array.isArray(mappedItems) ? (mappedItems as Record<string, unknown>[]) : [];
          const nextPage = typeof mappedPage === 'number' ? mappedPage : currentPage;
          const nextTotalPages = typeof mappedTotalPages === 'number' ? mappedTotalPages : Math.max(1, Math.ceil(nextItems.length / itemsPerPage) || 1);
          const nextTotalItems = typeof mappedTotalItems === 'number' ? mappedTotalItems : nextItems.length;

          setServerState({ items: nextItems, page: nextPage, totalPages: Math.max(1, nextTotalPages), totalItems: nextTotalItems });
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          setServerState({ items: [], page: 1, totalPages: 1, totalItems: 0 });
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load data.');
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, hasDataSource, itemsPerPage, props.dataSource?.api, props.dataSource?.type, props.dataSource?.method, queryKey]);

  const displayedItems = hasDataSource
    ? serverState.items
    : staticItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = hasDataSource ? serverState.totalPages : staticTotalPages;
  const effectivePage = hasDataSource ? serverState.page : currentPage;
  const isEmpty = displayedItems.length === 0;

  const resolvedStyle = resolveNodeStyle(node, 'container', {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    gap: '12px',
  });

  const isFirstPage = effectivePage === 1;
  const isLastPage = effectivePage === totalPages;

  return (
    <div style={resolvedStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto', gap: '12px' }}>
        {isLoading ? (
            <InlineSpinner />
        ) : errorMessage ? (
          renderEmptyState('Unable to load data', errorMessage)
        ) : isEmpty ? (
          renderEmptyState(props.emptyTitle ?? 'No data available', props.emptySubtitle ?? 'Please try again later')
        ) : (
          displayedItems.map((item, i) => (
            <DynamicRenderer key={`${effectivePage}-${i}`} node={{ type: props.itemType, props: { ...item, ...props.extraProps } }} />
          ))
        )}
      </div>

      {!isLoading && !errorMessage && !isEmpty && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '4px' }}>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={isFirstPage}
            style={{
              minWidth: '88px', padding: '10px 14px', borderRadius: '10px',
              border: `1px solid ${theme.border}`, backgroundColor: theme.transparent,
              color: isFirstPage ? theme.muted : theme.textPrimary,
              cursor: isFirstPage ? 'not-allowed' : 'pointer',
              opacity: isFirstPage ? 0.6 : 1,
              fontSize: '13px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
            }}
          >
            Previous
          </button>
          <p style={{ margin: 0, color: theme.textSecondary, fontSize: '13px', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
            {`Page ${effectivePage} of ${totalPages}`}
          </p>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={isLastPage}
            style={{
              minWidth: '88px', padding: '10px 14px', borderRadius: '10px',
              border: `1px solid ${theme.border}`, backgroundColor: theme.transparent,
              color: isLastPage ? theme.muted : theme.textPrimary,
              cursor: isLastPage ? 'not-allowed' : 'pointer',
              opacity: isLastPage ? 0.6 : 1,
              fontSize: '13px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
