import type { Request, RequestHandler } from 'express';

import { AppError } from '../../errors/app-error.js';
import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  searchClients,
  updateClient,
} from './client.service.js';
import type {
  ClientIdParams,
  ClientListQuery,
  ClientSearchInput,
  CreateClientInput,
  UpdateClientInput,
} from './client.schemas.js';
import type { ClientListData, PublicClient } from './client.types.js';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

export const create: RequestHandler = async (request, response, next) => {
  try {
    const client = await createClient(
      workspaceId(request),
      validated<CreateClientInput>(request, 'body'),
    );

    response.status(201).json({
      success: true,
      data: { client },
    } satisfies SuccessResponse<{ client: PublicClient }>);
  } catch (error) {
    next(error);
  }
};

export const list: RequestHandler = async (request, response, next) => {
  try {
    const data = await listClients(
      workspaceId(request),
      validated<ClientListQuery>(request, 'query'),
    );

    response.status(200).json({ success: true, data } satisfies SuccessResponse<ClientListData>);
  } catch (error) {
    next(error);
  }
};

export const search: RequestHandler = async (request, response, next) => {
  try {
    const data = await searchClients(
      workspaceId(request),
      validated<ClientSearchInput>(request, 'body'),
    );

    response.set('Cache-Control', 'private, no-store');
    response.status(200).json({ success: true, data } satisfies SuccessResponse<ClientListData>);
  } catch (error) {
    next(error);
  }
};

export const getById: RequestHandler = async (request, response, next) => {
  try {
    const { clientId } = validated<ClientIdParams>(request, 'params');
    const client = await getClient(workspaceId(request), clientId);

    response.status(200).json({
      success: true,
      data: { client },
    } satisfies SuccessResponse<{ client: PublicClient }>);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (request, response, next) => {
  try {
    const { clientId } = validated<ClientIdParams>(request, 'params');
    const client = await updateClient(
      workspaceId(request),
      clientId,
      validated<UpdateClientInput>(request, 'body'),
    );

    response.status(200).json({
      success: true,
      data: { client },
    } satisfies SuccessResponse<{ client: PublicClient }>);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (request, response, next) => {
  try {
    const { clientId } = validated<ClientIdParams>(request, 'params');
    await deleteClient(workspaceId(request), clientId);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

function workspaceId(request: Request): string {
  if (request.workspace === undefined) {
    throw new AppError({
      statusCode: 401,
      message: 'Authentication is required',
      code: 'AUTHENTICATION_REQUIRED',
    });
  }

  return request.workspace.id;
}

function validated<T>(request: Request, location: 'body' | 'params' | 'query'): T {
  const value = request.validated?.[location];

  if (value === undefined) {
    throw new AppError({
      statusCode: 500,
      message: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
      isOperational: false,
    });
  }

  return value as T;
}
