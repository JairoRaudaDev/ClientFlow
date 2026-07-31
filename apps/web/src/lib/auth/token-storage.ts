const ACCESS_TOKEN_KEY = 'clientflow.accessToken';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/** Returns false when storage is unavailable so callers can avoid starting a session that will not persist. */
export function saveAccessToken(token: string): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    return true;
  } catch {
    return false;
  }
}

export function getAccessToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearAccessToken(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // Nothing to recover if storage access fails.
  }
}
