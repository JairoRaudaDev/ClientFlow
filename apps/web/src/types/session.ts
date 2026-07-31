import type { AuthenticationData, PublicMembership, PublicUser } from '@/types/auth';

export type SessionStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';

export type SessionEndReason = 'expired' | 'invalid' | 'logged-out' | null;

/** API error codes that mean the access token itself is no longer usable. */
export type AuthenticationErrorCode =
  | 'ACCESS_TOKEN_EXPIRED'
  | 'INVALID_ACCESS_TOKEN'
  | 'AUTHENTICATION_REQUIRED'
  | 'INVALID_AUTHORIZATION_HEADER';

export interface SessionError {
  message: string;
}

export interface LogoutOptions {
  reason?: SessionEndReason;
}

export interface SessionContextValue {
  status: SessionStatus;
  user: PublicUser | null;
  memberships: PublicMembership[];
  accessToken: string | null;
  error: SessionError | null;
  endReason: SessionEndReason;
  /** Returns false when the token could not be persisted; the caller must not navigate on failure. */
  startSession: (data: AuthenticationData) => boolean;
  refreshSession: () => Promise<void>;
  logout: (options?: LogoutOptions) => void;
  /** Ends the session in response to an authentication failure reported by any protected API call. */
  handleAuthenticationFailure: (code: AuthenticationErrorCode) => void;
}
