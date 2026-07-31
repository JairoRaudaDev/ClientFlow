'use client';

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { useSession } from '@/hooks/use-session';
import {
  clearStoredWorkspaceId,
  getStoredWorkspaceId,
  saveStoredWorkspaceId,
} from '@/lib/workspace/workspace-storage';
import type { PublicMembership } from '@/types/auth';
import type { ActiveWorkspaceContextValue, ActiveWorkspaceStatus } from '@/types/workspace';

interface ResolvedWorkspace {
  status: ActiveWorkspaceStatus;
  activeWorkspaceId: string | null;
}

function resolveActiveWorkspace(
  memberships: PublicMembership[],
  storedId: string | null,
): ResolvedWorkspace {
  if (memberships.length === 0) {
    return { status: 'unavailable', activeWorkspaceId: null };
  }

  if (memberships.length === 1) {
    const only = memberships[0];
    return only !== undefined
      ? { status: 'ready', activeWorkspaceId: only.workspace.id }
      : { status: 'unavailable', activeWorkspaceId: null };
  }

  if (storedId !== null && memberships.some((membership) => membership.workspace.id === storedId)) {
    return { status: 'ready', activeWorkspaceId: storedId };
  }

  return { status: 'selection-required', activeWorkspaceId: null };
}

export const ActiveWorkspaceContext = createContext<ActiveWorkspaceContextValue | undefined>(
  undefined,
);

export function ActiveWorkspaceProvider({ children }: { children: ReactNode }) {
  const { memberships } = useSession();
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [status, setStatus] = useState<ActiveWorkspaceStatus>('initializing');
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);
  const hasResolvedRef = useRef(false);
  const activeWorkspaceIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeWorkspaceIdRef.current = activeWorkspaceId;
  }, [activeWorkspaceId]);

  // Resolution intentionally reads sessionStorage only inside this client-only effect, never
  // during render, so the server-rendered and first client-rendered markup always match.
  useEffect(() => {
    const storedId = hasResolvedRef.current ? activeWorkspaceIdRef.current : getStoredWorkspaceId();
    const resolved = resolveActiveWorkspace(memberships, storedId);

    hasResolvedRef.current = true;
    setStatus(resolved.status);
    setActiveWorkspaceId(resolved.activeWorkspaceId);

    if (resolved.activeWorkspaceId !== null) {
      saveStoredWorkspaceId(resolved.activeWorkspaceId);
    } else if (storedId !== null) {
      clearStoredWorkspaceId();
    }
  }, [memberships]);

  useEffect(() => {
    return () => {
      clearStoredWorkspaceId();
    };
  }, []);

  const selectWorkspace = useCallback(
    (workspaceId: string) => {
      const membership = memberships.find((item) => item.workspace.id === workspaceId);

      if (membership === undefined) {
        return;
      }

      setAccessDeniedMessage(null);
      setActiveWorkspaceId(workspaceId);
      setStatus('ready');
      saveStoredWorkspaceId(workspaceId);
    },
    [memberships],
  );

  const clearWorkspace = useCallback(() => {
    setActiveWorkspaceId(null);
    clearStoredWorkspaceId();
    setStatus(memberships.length === 0 ? 'unavailable' : 'selection-required');
  }, [memberships]);

  const reportWorkspaceAccessDenied = useCallback(() => {
    setAccessDeniedMessage(
      'You no longer have access to that workspace. Select another workspace to continue.',
    );
    setActiveWorkspaceId(null);
    clearStoredWorkspaceId();
    setStatus(memberships.length === 0 ? 'unavailable' : 'selection-required');
  }, [memberships]);

  const activeMembership = useMemo(
    () => memberships.find((membership) => membership.workspace.id === activeWorkspaceId) ?? null,
    [memberships, activeWorkspaceId],
  );

  const value = useMemo<ActiveWorkspaceContextValue>(
    () => ({
      status,
      activeWorkspace: activeMembership?.workspace ?? null,
      activeMembership,
      memberships,
      accessDeniedMessage,
      selectWorkspace,
      clearWorkspace,
      reportWorkspaceAccessDenied,
    }),
    [
      status,
      activeMembership,
      memberships,
      accessDeniedMessage,
      selectWorkspace,
      clearWorkspace,
      reportWorkspaceAccessDenied,
    ],
  );

  return (
    <ActiveWorkspaceContext.Provider value={value}>{children}</ActiveWorkspaceContext.Provider>
  );
}
