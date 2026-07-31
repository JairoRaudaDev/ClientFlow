import type { SessionEndReason } from '@/types/session';

const TOKEN_INVALIDATING_CODES: Record<string, Exclude<SessionEndReason, null>> = {
  ACCESS_TOKEN_EXPIRED: 'expired',
  INVALID_ACCESS_TOKEN: 'invalid',
  AUTHENTICATION_REQUIRED: 'invalid',
  INVALID_AUTHORIZATION_HEADER: 'invalid',
};

/**
 * Classifies a recognized `/auth/me` API error code as a session-invalidating failure.
 * Returns null for codes that should be treated as a temporary, recoverable failure
 * (network errors, timeouts, 5xx responses, and unrecognized codes never clear the token).
 */
export function classifySessionFailure(code: string | undefined): SessionEndReason | null {
  if (code === undefined) {
    return null;
  }

  return TOKEN_INVALIDATING_CODES[code] ?? null;
}
