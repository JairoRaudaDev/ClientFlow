'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { useSession } from '@/hooks/use-session';

import { SessionError } from './session-error';
import { SessionLoading } from './session-loading';

interface GuestOnlyRouteProps {
  /** Sanitized post-authentication destination, already validated against the workspace allowlist. */
  destination: string;
  children: ReactNode;
}

export function GuestOnlyRoute({ destination, children }: GuestOnlyRouteProps) {
  const { status, logout, refreshSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(destination);
    }
  }, [status, destination, router]);

  function handleClearSession() {
    logout({ reason: null });
  }

  if (status === 'unauthenticated') {
    return <>{children}</>;
  }

  if (status === 'error') {
    return (
      <SessionError
        onRetry={refreshSession}
        onSignOut={handleClearSession}
        signOutLabel="Clear session and continue"
      />
    );
  }

  return <SessionLoading />;
}
