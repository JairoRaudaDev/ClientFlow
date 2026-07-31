'use client';

import type { ReactNode } from 'react';

import { SessionProvider } from '@/components/auth/session-provider';

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
