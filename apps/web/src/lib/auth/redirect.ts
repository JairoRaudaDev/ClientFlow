const ALLOWED_WORKSPACE_ROUTES = ['/dashboard', '/clients', '/settings'];

const DEFAULT_DESTINATION = '/dashboard';

/**
 * Validates a post-authentication destination against an allowlist of internal workspace
 * routes. Anything else (absolute URLs, protocol-relative URLs, `javascript:` URLs, backslash
 * tricks, `/login`, `/register`, or unknown paths) falls back to the dashboard so we never
 * introduce an open redirect.
 */
export function sanitizeRedirectPath(candidate: string | null | undefined): string {
  if (candidate === null || candidate === undefined || candidate.length === 0) {
    return DEFAULT_DESTINATION;
  }

  if (candidate.includes('\\')) {
    return DEFAULT_DESTINATION;
  }

  if (!candidate.startsWith('/') || candidate.startsWith('//')) {
    return DEFAULT_DESTINATION;
  }

  let pathname: string;

  try {
    pathname = new URL(candidate, 'http://internal.invalid').pathname;
  } catch {
    return DEFAULT_DESTINATION;
  }

  const isAllowed = ALLOWED_WORKSPACE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  return isAllowed ? pathname : DEFAULT_DESTINATION;
}

/**
 * Reads a single query-parameter value. Next.js represents repeated query keys as arrays; we
 * treat that ambiguous case as absent rather than guessing which value was intended.
 */
export function firstSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? undefined : value;
}
