export interface Client {
  id: string;
  workspaceId: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
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
  clients: Client[];
  pagination: ClientPagination;
}

export type ClientSortField = 'name' | 'company' | 'createdAt' | 'updatedAt';
export type ClientSortDirection = 'asc' | 'desc';

export interface ClientListOptions {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: ClientSortField;
  sortOrder?: ClientSortDirection;
}

export interface ClientStructuredSearchInput {
  search?: string;
  filters?: {
    hasEmail?: boolean;
    hasPhone?: boolean;
  };
  sort?: {
    field?: ClientSortField;
    direction?: ClientSortDirection;
  };
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

export interface CreateClientInput {
  name: string;
  email?: string | null;
  company?: string | null;
  phone?: string | null;
  notes?: string | null;
}

export interface UpdateClientInput {
  name?: string;
  email?: string | null;
  company?: string | null;
  phone?: string | null;
  notes?: string | null;
}
