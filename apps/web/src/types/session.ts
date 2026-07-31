import type { AuthenticationData, PublicMembership, PublicUser } from '@/types/auth';

export type SessionStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';

export type SessionEndReason = 'expired' | 'invalid' | 'logged-out' | null;

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
}
