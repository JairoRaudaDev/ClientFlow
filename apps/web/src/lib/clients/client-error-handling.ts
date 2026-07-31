import { ApiRequestError } from '@/lib/api/errors';
import type { AuthenticationErrorCode } from '@/types/session';

const AUTH_FAILURE_CODES: ReadonlySet<string> = new Set<AuthenticationErrorCode>([
  'ACCESS_TOKEN_EXPIRED',
  'INVALID_ACCESS_TOKEN',
  'AUTHENTICATION_REQUIRED',
  'INVALID_AUTHORIZATION_HEADER',
]);

export function isAuthFailureCode(code: string | undefined): code is AuthenticationErrorCode {
  return code !== undefined && AUTH_FAILURE_CODES.has(code);
}

/** Maps a caught error to a safe, user-facing message. Never surfaces raw API/internal details. */
export function mapClientApiErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.kind === 'network' || error.kind === 'timeout' || error.kind === 'parse') {
      return error.message;
    }

    if (error.kind === 'api') {
      if (error.code === 'WORKSPACE_HEADER_REQUIRED' || error.code === 'INVALID_WORKSPACE_HEADER') {
        return 'We could not confirm your workspace. Please try again.';
      }

      return error.message;
    }
  }

  return 'Something went wrong. Please try again.';
}
