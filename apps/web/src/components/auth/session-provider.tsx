'use client';

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { getCurrentUser } from '@/lib/api/auth';
import { ApiRequestError } from '@/lib/api/errors';
import { classifySessionFailure } from '@/lib/auth/session-error';
import { clearAccessToken, getAccessToken, saveAccessToken } from '@/lib/auth/token-storage';
import type {
  AuthenticationData,
  PublicMembership,
  PublicUser,
} from '@/types/auth';
import type {
  SessionContextValue,
  SessionEndReason,
  SessionStatus,
} from '@/types/session';

const MIN_REVALIDATION_INTERVAL_MS = 60_000;

interface SessionState {
  status: SessionStatus;
  user: PublicUser | null;
  memberships: PublicMembership[];
  accessToken: string | null;
  error: { message: string } | null;
  endReason: SessionEndReason;
}

const initialState: SessionState = {
  status: 'initializing',
  user: null,
  memberships: [],
  accessToken: null,
  error: null,
  endReason: null,
};

export const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initialState);

  const mountedRef = useRef(true);
  const activeRequestRef = useRef<AbortController | null>(null);
  const lastValidatedAtRef = useRef(0);
  const statusRef = useRef(state.status);
  const tokenRef = useRef(state.accessToken);

  useEffect(() => {
    statusRef.current = state.status;
    tokenRef.current = state.accessToken;
  }, [state.status, state.accessToken]);

  const runValidation = useCallback(async (token: string) => {
    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;

    try {
      const data = await getCurrentUser(token, { signal: controller.signal });

      if (!mountedRef.current || activeRequestRef.current !== controller) {
        return;
      }

      lastValidatedAtRef.current = Date.now();
      setState({
        status: 'authenticated',
        user: data.user,
        memberships: data.memberships,
        accessToken: token,
        error: null,
        endReason: null,
      });
    } catch (error) {
      if (!mountedRef.current || activeRequestRef.current !== controller) {
        return;
      }

      if (error instanceof ApiRequestError && error.kind === 'aborted') {
        return;
      }

      if (error instanceof ApiRequestError && error.kind === 'api') {
        const endReason = classifySessionFailure(error.code);

        if (endReason !== null) {
          clearAccessToken();
          setState({
            status: 'unauthenticated',
            user: null,
            memberships: [],
            accessToken: null,
            error: null,
            endReason,
          });
          return;
        }
      }

      setState((previous) => ({
        ...previous,
        status: 'error',
        accessToken: token,
        error: { message: "We couldn't verify your session." },
      }));
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const token = getAccessToken();

    queueMicrotask(() => {
      if (!mountedRef.current) {
        return;
      }

      if (token === null) {
        setState((previous) => ({ ...previous, status: 'unauthenticated' }));
      } else {
        void runValidation(token);
      }
    });

    return () => {
      mountedRef.current = false;
      activeRequestRef.current?.abort();
    };
  }, [runValidation]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState !== 'visible') {
        return;
      }

      if (statusRef.current !== 'authenticated' || tokenRef.current === null) {
        return;
      }

      if (Date.now() - lastValidatedAtRef.current < MIN_REVALIDATION_INTERVAL_MS) {
        return;
      }

      void runValidation(tokenRef.current);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [runValidation]);

  const startSession = useCallback((data: AuthenticationData): boolean => {
    if (!saveAccessToken(data.accessToken)) {
      return false;
    }

    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    lastValidatedAtRef.current = Date.now();

    setState({
      status: 'authenticated',
      user: data.user,
      memberships: data.memberships,
      accessToken: data.accessToken,
      error: null,
      endReason: null,
    });

    return true;
  }, []);

  const refreshSession = useCallback(async () => {
    const token = tokenRef.current ?? getAccessToken();

    if (token === null) {
      setState((previous) => ({ ...previous, status: 'unauthenticated' }));
      return;
    }

    await runValidation(token);
  }, [runValidation]);

  const logout = useCallback((options?: { reason?: SessionEndReason }) => {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    clearAccessToken();

    setState({
      status: 'unauthenticated',
      user: null,
      memberships: [],
      accessToken: null,
      error: null,
      endReason: options?.reason !== undefined ? options.reason : 'logged-out',
    });
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      status: state.status,
      user: state.user,
      memberships: state.memberships,
      accessToken: state.accessToken,
      error: state.error,
      endReason: state.endReason,
      startSession,
      refreshSession,
      logout,
    }),
    [state, startSession, refreshSession, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
