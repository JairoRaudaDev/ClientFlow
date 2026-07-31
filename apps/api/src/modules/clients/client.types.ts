import type { MembershipRole } from '../../generated/prisma/client.js';

export interface PublicClient {
  id: string;
  workspaceId: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ClientListData {
  clients: PublicClient[];
  pagination: ClientPagination;
}

export interface ClientWorkspaceContext {
  id: string;
  name: string;
  membershipId: string;
  role: MembershipRole;
}
