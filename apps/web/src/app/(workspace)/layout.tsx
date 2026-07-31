import type { ReactNode } from 'react';

import { AuthenticatedRoute } from '@/components/auth/authenticated-route';
import { AppShell } from '@/components/layout/AppShell';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <AuthenticatedRoute>
      <AppShell>{children}</AppShell>
    </AuthenticatedRoute>
  );
}
