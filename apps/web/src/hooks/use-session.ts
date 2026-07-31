'use client';

import { useContext } from 'react';

import { SessionContext } from '@/components/auth/session-provider';
import type { SessionContextValue } from '@/types/session';

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
}
