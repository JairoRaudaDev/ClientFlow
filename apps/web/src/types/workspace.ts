import type { PublicMembership, PublicWorkspace } from '@/types/auth';

export type ActiveWorkspaceStatus = 'initializing' | 'ready' | 'selection-required' | 'unavailable';

export interface ActiveWorkspaceContextValue {
  status: ActiveWorkspaceStatus;
  activeWorkspace: PublicWorkspace | null;
  activeMembership: PublicMembership | null;
  memberships: PublicMembership[];
  /** Safe, user-facing message set after a `WORKSPACE_ACCESS_DENIED` response. Cleared on selection. */
  accessDeniedMessage: string | null;
  selectWorkspace: (workspaceId: string) => void;
  clearWorkspace: () => void;
  /** Called by client-data hooks when the API reports the active workspace is no longer accessible. */
  reportWorkspaceAccessDenied: () => void;
}
