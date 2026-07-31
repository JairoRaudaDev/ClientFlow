import type { Metadata } from 'next';
import Link from 'next/link';

import { GuestOnlyRoute } from '@/components/auth/guest-only-route';
import { LoginForm } from '@/components/auth/login-form';
import { Card } from '@/components/ui/Card';
import { firstSearchParamValue, sanitizeRedirectPath } from '@/lib/auth/redirect';

export const metadata: Metadata = {
  title: 'Log in',
};

const LOGIN_NOTICES: Record<string, string> = {
  'session-expired': 'Your session expired. Please sign in again.',
  'session-invalid': 'Your session is no longer valid. Please sign in again.',
  'logged-out': 'You have signed out.',
};

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const destination = sanitizeRedirectPath(firstSearchParamValue(params.next));
  const reason = firstSearchParamValue(params.reason);
  const notice = reason !== undefined ? LOGIN_NOTICES[reason] : undefined;

  return (
    <GuestOnlyRoute destination={destination}>
      <Card className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-foreground text-xl font-semibold">Log in</h1>
          <p className="text-muted text-sm">Welcome back. Enter your credentials to continue.</p>
        </div>
        {notice !== undefined ? (
          <p
            role="status"
            aria-live="polite"
            className="border-border bg-accent-muted text-foreground rounded-md border px-3 py-2 text-sm"
          >
            {notice}
          </p>
        ) : null}
        <LoginForm redirectTo={destination} />
        <p className="text-muted text-sm">
          New to ClientFlow?{' '}
          <Link href="/register" className="text-accent font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </GuestOnlyRoute>
  );
}
