export type MembershipRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicWorkspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicMembership {
  id: string;
  role: MembershipRole;
  workspace: PublicWorkspace;
}

export interface AuthenticationData {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: PublicUser;
  memberships: PublicMembership[];
}

export interface AuthenticationResponse {
  success: true;
  data: AuthenticationData;
}
