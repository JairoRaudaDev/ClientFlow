'use client';

import { useRouter } from 'next/navigation';

import { useSession } from '@/hooks/use-session';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '';
  }

  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';

  return `${first}${last}`.toUpperCase();
}

export function SessionAccount() {
  const { user, logout } = useSession();
  const router = useRouter();

  if (user === null) {
    return null;
  }

  function handleLogout() {
    logout();
    router.replace('/login?reason=logged-out');
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        aria-hidden="true"
        className="bg-accent-muted text-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
      >
        {getInitials(user.name)}
      </div>
      <div className="hidden min-w-0 text-sm sm:block">
        <p className="text-foreground truncate font-medium">{user.name}</p>
        <p className="text-muted truncate">{user.email}</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="text-muted hover:text-foreground focus-visible:ring-accent shrink-0 rounded-md px-2 py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        Log out
      </button>
    </div>
  );
}
