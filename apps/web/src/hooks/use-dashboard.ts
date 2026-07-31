'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { listClients } from '@/lib/api/clients';
import { ApiRequestError } from '@/lib/api/errors';
import { isAuthFailureCode, mapClientApiErrorMessage } from '@/lib/clients/client-error-handling';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useSession } from '@/hooks/use-session';
import type { ClientListData } from '@/types/client';

const DASHBOARD_PAGE_SIZE = 5;

interface UseDashboardResult {
  data: ClientListData | null;
  isLoading: boolean;
  errorMessage: string | null;
  retry: () => void;
}

/**
 * Loads the small client snapshot shown on the dashboard: the five most recently updated
 * clients plus the total client count from the pagination metadata. Reuses the client API
 * module, session provider, and active workspace provider. Dashboard data is never stored in
 * browser storage and stale requests for a previous workspace are discarded.
 */
export function useDashboard(): UseDashboardResult {
  const { accessToken, handleAuthenticationFailure } = useSession();
  const { status, activeWorkspace, reportWorkspaceAccessDenied } = useActiveWorkspace();
  const [data, setData] = useState<ClientListData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const mountedRef = useRef(true);
  const loadedWorkspaceIdRef = useRef<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const workspaceId = activeWorkspace?.id ?? null;

  useEffect(() => {
    // Never render clients from a previous workspace while the new workspace is still loading.
    if (workspaceId !== loadedWorkspaceIdRef.current) {
      loadedWorkspaceIdRef.current = workspaceId;
      setData(null);
    }

    if (status !== 'ready' || workspaceId === null || accessToken === null) {
      queueMicrotask(() => {
        if (!mountedRef.current) {
          return;
        }

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

    listClients(
      { accessToken, workspaceId },
      {
        page: 1,
        pageSize: DASHBOARD_PAGE_SIZE,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      },
      { signal: controller.signal },
    )
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
  }, [
    status,
    workspaceId,
    accessToken,
    retryToken,
    handleAuthenticationFailure,
    reportWorkspaceAccessDenied,
  ]);

  const retry = useCallback(() => setRetryToken((token) => token + 1), []);

  return { data, isLoading, errorMessage, retry };
}
