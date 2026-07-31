'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getClient } from '@/lib/api/clients';
import { ApiRequestError } from '@/lib/api/errors';
import { isAuthFailureCode, mapClientApiErrorMessage } from '@/lib/clients/client-error-handling';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useSession } from '@/hooks/use-session';
import type { Client } from '@/types/client';

interface UseClientResult {
  client: Client | null;
  isLoading: boolean;
  errorMessage: string | null;
  notFound: boolean;
  retry: () => void;
}

/** Pass `null` for an invalid/unvalidated route id to skip fetching entirely. */
export function useClient(clientId: string | null): UseClientResult {
  const { accessToken, handleAuthenticationFailure } = useSession();
  const { status, activeWorkspace, reportWorkspaceAccessDenied } = useActiveWorkspace();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
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
    if (clientId === null || status !== 'ready' || workspaceId === null || accessToken === null) {
      return;
    }

    const controller = new AbortController();

    queueMicrotask(() => {
      if (mountedRef.current) {
        setIsLoading(true);
        setErrorMessage(null);
        setNotFound(false);
      }
    });

    getClient({ accessToken, workspaceId }, clientId, { signal: controller.signal })
      .then((result) => {
        if (!mountedRef.current || controller.signal.aborted) {
          return;
        }

        setClient(result);
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

          if (error.code === 'CLIENT_NOT_FOUND') {
            setNotFound(true);
            return;
          }
        }

        setErrorMessage(mapClientApiErrorMessage(error));
      });

    return () => {
      controller.abort();
    };
  }, [
    clientId,
    status,
    workspaceId,
    accessToken,
    retryToken,
    handleAuthenticationFailure,
    reportWorkspaceAccessDenied,
  ]);

  const retry = useCallback(() => setRetryToken((token) => token + 1), []);

  return { client, isLoading, errorMessage, notFound, retry };
}
