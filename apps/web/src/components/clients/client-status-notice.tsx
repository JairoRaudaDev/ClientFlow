'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const ALLOWED_STATUS_MESSAGES: Record<string, string> = {
  created: 'Client created successfully.',
  updated: 'Client updated successfully.',
  deleted: 'Client deleted successfully.',
};

/** Reads an allowlisted `?status=` value, shows a success notice, then strips it from the URL. */
export function ClientStatusNotice() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const message = status !== null ? ALLOWED_STATUS_MESSAGES[status] : undefined;

  useEffect(() => {
    if (message === undefined) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');
    const query = params.toString();
    router.replace(query.length > 0 ? `${pathname}?${query}` : pathname, { scroll: false });
    // Only re-run when the status value itself changes, not on every searchParams identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (message === undefined) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
    >
      {message}
    </div>
  );
}
