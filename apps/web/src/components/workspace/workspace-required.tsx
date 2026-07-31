'use client';

import { Card } from '@/components/ui/Card';
import { WorkspaceSelector } from '@/components/workspace/workspace-selector';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';

/** Blocking gate shown instead of client content whenever no active workspace is resolved. */
export function WorkspaceRequired() {
  const { status, accessDeniedMessage } = useActiveWorkspace();

  if (status === 'unavailable') {
    return (
      <Card className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-foreground text-sm font-medium">No workspace access</h2>
        <p className="text-muted max-w-sm text-sm">
          Your account is not a member of any workspace yet. Contact a workspace owner for an
          invitation.
        </p>
      </Card>
    );
  }

  if (status === 'initializing') {
    return (
      <p role="status" aria-live="polite" className="text-muted text-sm">
        Loading workspace...
      </p>
    );
  }

  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <div>
        <h2 className="text-foreground text-sm font-medium">Select a workspace</h2>
        <p className="text-muted mt-2 max-w-sm text-sm">
          {accessDeniedMessage ?? 'Choose a workspace to view its clients.'}
        </p>
      </div>
      <WorkspaceSelector />
    </Card>
  );
}
