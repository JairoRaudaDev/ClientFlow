'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { listClients, searchClients } from '@/lib/api/clients';
import { ApiRequestError } from '@/lib/api/errors';
import { isAuthFailureCode, mapClientApiErrorMessage } from '@/lib/clients/client-error-handling';
import {
  CLIENT_LIST_PAGE_SIZE,
  hasFilterToBoolean,
  hasStructuredFilters,
} from '@/lib/clients/client-query-state';
import type { ClientListQueryState } from '@/lib/clients/client-query-state';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useSession } from '@/hooks/use-session';
import type { ClientListData } from '@/types/client';

interface UseClientsResult {
  data: ClientListData | null;
  isLoading: boolean;
  errorMessage: string | null;
  retry: () => void;
}

export function useClients(query: ClientListQueryState): UseClientsResult {
  const { accessToken, handleAuthenticationFailure } = useSession();
  const { status, activeWorkspace, reportWorkspaceAccessDenied } = useActiveWorkspace();
  const [data, setData] = useState<ClientListData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const workspaceId = activeWorkspace?.id ?? null;

  useEffect(() => {
    if (status !== 'ready' || workspaceId === null || accessToken === null) {
      queueMicrotask(() => {
        if (!mountedRef.current) {
          return;
        }

        setData(null);
        setIsLoading(false);
        setErrorMessage(null);
      });
      return;
    }

    const controller = new AbortController();

    queueMicrotask(() => {
      if (mountedRef.current) {
        setIsLoading(true);
        setErrorMessage(null);
      }
    });

    const context = { accessToken, workspaceId };

    const request = hasStructuredFilters(query)
      ? searchClients(
          context,
          {
            search: query.q.length > 0 ? query.q : undefined,
            filters: {
              hasEmail: hasFilterToBoolean(query.hasEmail),
              hasPhone: hasFilterToBoolean(query.hasPhone),
            },
            sort: { field: query.sortBy, direction: query.sortOrder },
            pagination: { page: query.page, pageSize: CLIENT_LIST_PAGE_SIZE },
          },
          { signal: controller.signal },
        )
      : listClients(
          context,
          {
            q: query.q.length > 0 ? query.q : undefined,
            page: query.page,
            pageSize: CLIENT_LIST_PAGE_SIZE,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
          },
          { signal: controller.signal },
        );

    request
      .then((result) => {
        if (!mountedRef.current || controller.signal.aborted) {
          return;
        }

        setData(result);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (!mountedRef.current || controller.signal.aborted) {
          return;
        }

        if (error instanceof ApiRequestError && error.kind === 'aborted') {
          return;
        }

        setIsLoading(false);

        if (error instanceof ApiRequestError && error.kind === 'api') {
          if (isAuthFailureCode(error.code)) {
            handleAuthenticationFailure(error.code);
            return;
          }

          if (error.code === 'WORKSPACE_ACCESS_DENIED') {
            reportWorkspaceAccessDenied();
            return;
          }
        }

        setErrorMessage(mapClientApiErrorMessage(error));
      });

    return () => {
      controller.abort();
    };
    // Depend on individual query fields, not the `query` object itself, since it is a fresh
    // object on every render; listing it would refetch on every render instead of on real changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status,
    workspaceId,
    accessToken,
    query.q,
    query.page,
    query.sortBy,
    query.sortOrder,
    query.hasEmail,
    query.hasPhone,
    retryToken,
    handleAuthenticationFailure,
    reportWorkspaceAccessDenied,
  ]);

  const retry = useCallback(() => setRetryToken((token) => token + 1), []);

  return { data, isLoading, errorMessage, retry };
}
