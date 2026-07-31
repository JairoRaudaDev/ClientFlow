import type { Prisma } from '../../generated/prisma/client.js';

import { prisma } from '../../config/database.js';
import { AppError } from '../../errors/app-error.js';
import { mapClient } from './client.mapper.js';
import type {
  ClientListQuery,
  ClientSearchInput,
  CreateClientInput,
  UpdateClientInput,
} from './client.schemas.js';
import type { ClientListData, PublicClient } from './client.types.js';

const clientSelect = {
  id: true,
  workspaceId: true,
  name: true,
  email: true,
  company: true,
  phone: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ClientSelect;

type SortField = 'name' | 'company' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface PaginationInput {
  page?: number;
  pageSize?: number;
}

interface SearchFilters {
  hasEmail?: boolean;
  hasPhone?: boolean;
}

export async function createClient(
  workspaceId: string,
  input: CreateClientInput,
): Promise<PublicClient> {
  const client = await prisma.client.create({
    data: {
      workspaceId,
      name: input.name,
      email: input.email ?? null,
      company: input.company ?? null,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
    },
    select: clientSelect,
  });

  return mapClient(client);
}

export async function listClients(
  workspaceId: string,
  input: ClientListQuery,
): Promise<ClientListData> {
  return findClients(workspaceId, {
    search: input.q,
    page: input.page,
    pageSize: input.pageSize,
    sortField: input.sortBy,
    sortDirection: input.sortOrder,
  });
}

export async function searchClients(
  workspaceId: string,
  input: ClientSearchInput,
): Promise<ClientListData> {
  return findClients(workspaceId, {
    search: input.search,
    filters: input.filters,
    page: input.pagination?.page,
    pageSize: input.pagination?.pageSize,
    sortField: input.sort?.field,
    sortDirection: input.sort?.direction,
  });
}

export async function getClient(workspaceId: string, clientId: string): Promise<PublicClient> {
  const client = await prisma.client.findFirst({
    where: { id: clientId, workspaceId },
    select: clientSelect,
  });

  if (client === null) {
    throw clientNotFoundError();
  }

  return mapClient(client);
}

export async function updateClient(
  workspaceId: string,
  clientId: string,
  input: UpdateClientInput,
): Promise<PublicClient> {
  const updateResult = await prisma.client.updateMany({
    where: { id: clientId, workspaceId },
    data: input,
  });

  if (updateResult.count === 0) {
    throw clientNotFoundError();
  }

  const client = await prisma.client.findFirst({
    where: { id: clientId, workspaceId },
    select: clientSelect,
  });

  if (client === null) {
    throw clientNotFoundError();
  }

  return mapClient(client);
}

export async function deleteClient(workspaceId: string, clientId: string): Promise<void> {
  const deleteResult = await prisma.client.deleteMany({
    where: { id: clientId, workspaceId },
  });

  if (deleteResult.count === 0) {
    throw clientNotFoundError();
  }
}

interface FindClientsInput extends PaginationInput {
  search?: string;
  filters?: SearchFilters;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

async function findClients(workspaceId: string, input: FindClientsInput): Promise<ClientListData> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;
  const where = buildClientWhere(workspaceId, input.search, input.filters);
  const [total, clients] = await prisma.$transaction([
    prisma.client.count({ where }),
    prisma.client.findMany({
      where,
      orderBy: buildClientOrderBy(input.sortField ?? 'createdAt', input.sortDirection ?? 'desc'),
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: clientSelect,
    }),
  ]);
  const totalPages = Math.ceil(total / pageSize);

  return {
    clients: clients.map(mapClient),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

function buildClientWhere(
  workspaceId: string,
  search: string | undefined,
  filters: SearchFilters | undefined,
): Prisma.ClientWhereInput {
  const where: Prisma.ClientWhereInput = { workspaceId };

  if (search !== undefined) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (filters?.hasEmail !== undefined) {
    where.email = filters.hasEmail ? { not: null } : null;
  }

  if (filters?.hasPhone !== undefined) {
    where.phone = filters.hasPhone ? { not: null } : null;
  }

  return where;
}

function buildClientOrderBy(
  field: SortField,
  direction: SortDirection,
): Prisma.ClientOrderByWithRelationInput[] {
  switch (field) {
    case 'name':
      return [{ name: direction }, { id: direction }];
    case 'company':
      return [{ company: direction }, { id: direction }];
    case 'updatedAt':
      return [{ updatedAt: direction }, { id: direction }];
    case 'createdAt':
      return [{ createdAt: direction }, { id: direction }];
  }
}

function clientNotFoundError(): AppError {
  return new AppError({
    statusCode: 404,
    message: 'Client not found.',
    code: 'CLIENT_NOT_FOUND',
  });
}
