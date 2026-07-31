import type { ReactNode } from 'react';

import { AuthenticatedRoute } from '@/components/auth/authenticated-route';
import { AppShell } from '@/components/layout/AppShell';
import { ActiveWorkspaceProvider } from '@/components/workspace/active-workspace-provider';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <AuthenticatedRoute>
      <ActiveWorkspaceProvider>
        <AppShell>{children}</AppShell>
      </ActiveWorkspaceProvider>
    </AuthenticatedRoute>
  );
}
