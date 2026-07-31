'use client';

import { useState } from 'react';

import { Card } from '@/components/ui/Card';

interface SessionErrorProps {
  onRetry: () => Promise<void>;
  onSignOut: () => void;
  signOutLabel?: string;
}

export function SessionError({
  onRetry,
  onSignOut,
  signOutLabel = 'Sign out',
}: SessionErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  async function handleRetry() {
    if (isRetrying) {
      return;
    }

    setIsRetrying(true);

    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm space-y-4 text-center" role="alert">
        <h2 className="text-foreground text-lg font-semibold">
          We couldn&apos;t verify your session
        </h2>
        <p className="text-muted text-sm">
          The server may be temporarily unavailable. Try again or sign out and use another
          account.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => void handleRetry()}
            disabled={isRetrying}
            className="bg-accent text-accent-foreground focus-visible:ring-accent inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="border-border text-foreground hover:bg-accent-muted focus-visible:ring-accent inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {signOutLabel}
          </button>
        </div>
      </Card>
    </div>
  );
}
