import type {
  Client,
  ClientListData,
  ClientListOptions,
  ClientStructuredSearchInput,
  CreateClientInput,
  UpdateClientInput,
} from '@/types/client';

import { apiRequest } from './client';

/** Explicit per-request auth/workspace context — never stored globally on the API client. */
export interface ClientRequestContext {
  accessToken: string;
  workspaceId: string;
}

export interface ClientRequestOptions {
  signal?: AbortSignal;
}

function buildListQuery(options: ClientListOptions): string {
  const params = new URLSearchParams();

  if (options.q !== undefined && options.q.length > 0) {
    params.set('q', options.q);
  }

  if (options.page !== undefined) {
    params.set('page', String(options.page));
  }

  if (options.pageSize !== undefined) {
    params.set('pageSize', String(options.pageSize));
  }

  if (options.sortBy !== undefined) {
    params.set('sortBy', options.sortBy);
  }

  if (options.sortOrder !== undefined) {
    params.set('sortOrder', options.sortOrder);
  }

  const query = params.toString();
  return query.length > 0 ? `?${query}` : '';
}

export function listClients(
  context: ClientRequestContext,
  options: ClientListOptions,
  requestOptions?: ClientRequestOptions,
): Promise<ClientListData> {
  return apiRequest<ClientListData>(`/clients${buildListQuery(options)}`, {
    method: 'GET',
    accessToken: context.accessToken,
    workspaceId: context.workspaceId,
    signal: requestOptions?.signal,
  });
}

export function searchClients(
  context: ClientRequestContext,
  input: ClientStructuredSearchInput,
  requestOptions?: ClientRequestOptions,
): Promise<ClientListData> {
  return apiRequest<ClientListData, ClientStructuredSearchInput>('/clients/search', {
    method: 'QUERY',
    body: input,
    accessToken: context.accessToken,
    workspaceId: context.workspaceId,
    signal: requestOptions?.signal,
  });
}

export async function getClient(
  context: ClientRequestContext,
  clientId: string,
  requestOptions?: ClientRequestOptions,
): Promise<Client> {
  const data = await apiRequest<{ client: Client }>(`/clients/${encodeURIComponent(clientId)}`, {
    method: 'GET',
    accessToken: context.accessToken,
    workspaceId: context.workspaceId,
    signal: requestOptions?.signal,
  });

  return data.client;
}

export async function createClient(
  context: ClientRequestContext,
  input: CreateClientInput,
): Promise<Client> {
  const data = await apiRequest<{ client: Client }, CreateClientInput>('/clients', {
    method: 'POST',
    body: input,
    accessToken: context.accessToken,
    workspaceId: context.workspaceId,
  });

  return data.client;
}

export async function updateClient(
  context: ClientRequestContext,
  clientId: string,
  input: UpdateClientInput,
): Promise<Client> {
  const data = await apiRequest<{ client: Client }, UpdateClientInput>(
    `/clients/${encodeURIComponent(clientId)}`,
    {
      method: 'PATCH',
      body: input,
      accessToken: context.accessToken,
      workspaceId: context.workspaceId,
    },
  );

  return data.client;
}

export function deleteClient(context: ClientRequestContext, clientId: string): Promise<void> {
  return apiRequest<void>(`/clients/${encodeURIComponent(clientId)}`, {
    method: 'DELETE',
    accessToken: context.accessToken,
    workspaceId: context.workspaceId,
  });
}
