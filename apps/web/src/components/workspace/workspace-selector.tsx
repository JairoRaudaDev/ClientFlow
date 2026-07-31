'use client';

import { useActiveWorkspace } from '@/hooks/use-active-workspace';

export function WorkspaceSelector() {
  const { status, activeWorkspace, memberships, selectWorkspace } = useActiveWorkspace();

  if (status === 'unavailable' || memberships.length === 0) {
    return null;
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <label htmlFor="workspace-selector" className="sr-only">
        Active workspace
      </label>
      <select
        id="workspace-selector"
        value={activeWorkspace?.id ?? ''}
        onChange={(event) => {
          if (event.target.value !== '') {
            selectWorkspace(event.target.value);
          }
        }}
        disabled={memberships.length <= 1 && status === 'ready'}
        className="border-border bg-surface text-foreground focus-visible:ring-accent max-w-[10rem] truncate rounded-md border px-2 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-100 sm:max-w-[14rem]"
      >
        {status === 'selection-required' ? (
          <option value="" disabled>
            Select a workspace
          </option>
        ) : null}
        {memberships.map((membership) => (
          <option key={membership.workspace.id} value={membership.workspace.id}>
            {membership.workspace.name}
          </option>
        ))}
      </select>
    </div>
  );
}
