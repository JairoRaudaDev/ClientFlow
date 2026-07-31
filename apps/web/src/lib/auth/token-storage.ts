const ACCESS_TOKEN_KEY = 'clientflow.accessToken';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function saveAccessToken(token: string): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // Storage may be unavailable (private browsing, quota, disabled storage). Nothing to recover.
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
