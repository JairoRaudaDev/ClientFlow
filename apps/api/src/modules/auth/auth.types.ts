import type { MembershipRole } from '../../generated/prisma/client.js';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicWorkspace {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicMembership {
  id: string;
  role: MembershipRole;
  workspace: PublicWorkspace;
}

export interface AuthContext {
  user: PublicUser;
  memberships: PublicMembership[];
}

export interface AuthenticationData extends AuthContext {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

interface SafeUserRecord extends PublicUser {
  memberships: PublicMembership[];
}

export function mapAuthContext(user: SafeUserRecord): AuthContext {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    memberships: user.memberships.map((membership) => ({
      id: membership.id,
      role: membership.role,
      workspace: {
        id: membership.workspace.id,
        name: membership.workspace.name,
        createdAt: membership.workspace.createdAt,
        updatedAt: membership.workspace.updatedAt,
      },
    })),
  };
}
