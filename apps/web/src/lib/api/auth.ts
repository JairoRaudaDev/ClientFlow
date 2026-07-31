import type { AuthenticationData, PublicMembership, PublicUser } from '@/types/auth';

import { apiRequest } from './client';

export interface CurrentSessionData {
  user: PublicUser;
  memberships: PublicMembership[];
}

export interface GetCurrentUserOptions {
  signal?: AbortSignal;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  workspaceName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  workspaceName?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function register(input: RegisterInput): Promise<AuthenticationData> {
  const workspaceName = input.workspaceName?.trim();

  return apiRequest<AuthenticationData, RegisterRequestBody>('/auth/register', {
    method: 'POST',
    body: {
      name: input.name.trim(),
      email: normalizeEmail(input.email),
      password: input.password,
      ...(workspaceName === undefined || workspaceName.length === 0 ? {} : { workspaceName }),
    },
  });
}

export function login(input: LoginInput): Promise<AuthenticationData> {
  return apiRequest<AuthenticationData, LoginRequestBody>('/auth/login', {
    method: 'POST',
    body: {
      email: normalizeEmail(input.email),
      password: input.password,
    },
  });
}

export function getCurrentUser(
  accessToken: string,
  options?: GetCurrentUserOptions,
): Promise<CurrentSessionData> {
  return apiRequest<CurrentSessionData>('/auth/me', {
    method: 'GET',
    accessToken,
    signal: options?.signal,
  });
}
