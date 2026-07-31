const ACTIVE_WORKSPACE_KEY = 'clientflow.activeWorkspaceId';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getStoredWorkspaceId(): string | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.sessionStorage.getItem(ACTIVE_WORKSPACE_KEY);
  } catch {
    return null;
  }
}

export function saveStoredWorkspaceId(workspaceId: string): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.setItem(ACTIVE_WORKSPACE_KEY, workspaceId);
  } catch {
    // Nothing to recover if storage access fails.
  }
}

export function clearStoredWorkspaceId(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(ACTIVE_WORKSPACE_KEY);
  } catch {
    // Nothing to recover if storage access fails.
  }
}
