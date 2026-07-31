import type { Client } from '../../generated/prisma/client.js';
import type { PublicClient } from './client.types.js';

type ClientRecord = Pick<
  Client,
  | 'id'
  | 'workspaceId'
  | 'name'
  | 'email'
  | 'company'
  | 'phone'
  | 'notes'
  | 'createdAt'
  | 'updatedAt'
>;

export function mapClient(client: ClientRecord): PublicClient {
  return {
    id: client.id,
    workspaceId: client.workspaceId,
    name: client.name,
    email: client.email,
    company: client.company,
    phone: client.phone,
    notes: client.notes,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
}
