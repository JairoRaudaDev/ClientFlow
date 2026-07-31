'use client';

import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceRequired } from '@/components/workspace/workspace-required';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useSession } from '@/hooks/use-session';
import type { MembershipRole } from '@/types/auth';

const ROLE_LABELS: Record<MembershipRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
};

export function SettingsView() {
  const { user } = useSession();
  const { status, activeWorkspace, activeMembership } = useActiveWorkspace();

  if (status !== 'ready' || activeWorkspace === null || activeMembership === null || user === null) {
    return <WorkspaceRequired />;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Your account and workspace details." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-foreground text-base font-semibold">Account</h2>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted text-xs font-medium tracking-wide uppercase">Name</dt>
              <dd className="text-foreground mt-1 text-sm break-words">{user.name}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs font-medium tracking-wide uppercase">Email</dt>
              <dd className="text-foreground mt-1 text-sm break-words">{user.email}</dd>
            </div>
          </dl>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-foreground text-base font-semibold">Workspace</h2>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted text-xs font-medium tracking-wide uppercase">
                Active workspace
              </dt>
              <dd className="text-foreground mt-1 text-sm break-words">{activeWorkspace.name}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs font-medium tracking-wide uppercase">Your role</dt>
              <dd className="text-foreground mt-1 text-sm">
                {ROLE_LABELS[activeMembership.role]}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card>
        <h2 className="text-foreground text-base font-semibold">Session</h2>
        <p className="text-muted mt-2 max-w-2xl text-sm">
          Your access token is stored in this browser tab&apos;s sessionStorage and is cleared when
          you sign out or close the tab. Account and workspace management options are intentionally
          limited in this MVP.
        </p>
      </Card>
    </div>
  );
}
