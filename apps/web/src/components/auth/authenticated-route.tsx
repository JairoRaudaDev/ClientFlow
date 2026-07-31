'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { useSession } from '@/hooks/use-session';
import { sanitizeRedirectPath } from '@/lib/auth/redirect';

import { SessionError } from './session-error';
import { SessionLoading } from './session-loading';

export function AuthenticatedRoute({ children }: { children: ReactNode }) {
  const { status, endReason, logout, refreshSession } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== 'unauthenticated') {
      return;
    }

    // A manual sign-out already navigates to /login itself; avoid a second, conflicting redirect.
    if (endReason === 'logged-out') {
      return;
    }

    const next = sanitizeRedirectPath(pathname);
    const params = new URLSearchParams({ next });

    if (endReason === 'expired') {
      params.set('reason', 'session-expired');
    } else if (endReason === 'invalid') {
      params.set('reason', 'session-invalid');
    }

    router.replace(`/login?${params.toString()}`);
  }, [status, endReason, pathname, router]);

  function handleSignOut() {
    logout({ reason: 'logged-out' });
    router.replace('/login?reason=logged-out');
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  if (status === 'error') {
    return <SessionError onRetry={refreshSession} onSignOut={handleSignOut} />;
  }

  return <SessionLoading />;
}
