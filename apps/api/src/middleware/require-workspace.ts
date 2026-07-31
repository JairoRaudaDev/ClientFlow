import type { RequestHandler } from 'express';
import { z } from 'zod';

import { prisma } from '../config/database.js';
import { AppError } from '../errors/app-error.js';
import type { MembershipRole } from '../generated/prisma/client.js';

const workspaceIdSchema = z.uuid();

export interface RequestWorkspaceContext {
  id: string;
  name: string;
  membershipId: string;
  role: MembershipRole;
}

export const requireWorkspace: RequestHandler = async (request, _response, next) => {
  if (request.auth === undefined) {
    next(
      new AppError({
        statusCode: 401,
        message: 'Authentication is required',
        code: 'AUTHENTICATION_REQUIRED',
      }),
    );
    return;
  }

  const workspaceHeaderCount = countWorkspaceHeaders(request.rawHeaders);
  const workspaceIdHeader = request.headers['x-workspace-id'];

  if (workspaceHeaderCount === 0 || workspaceIdHeader === undefined) {
    next(
      new AppError({
        statusCode: 400,
        message: 'A workspace must be selected.',
        code: 'WORKSPACE_HEADER_REQUIRED',
      }),
    );
    return;
  }

  if (workspaceHeaderCount !== 1 || Array.isArray(workspaceIdHeader)) {
    next(invalidWorkspaceHeaderError());
    return;
  }

  const workspaceIdResult = workspaceIdSchema.safeParse(workspaceIdHeader);

  if (!workspaceIdResult.success) {
    next(invalidWorkspaceHeaderError());
    return;
  }

  try {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId: request.auth.user.id,
          workspaceId: workspaceIdResult.data,
        },
      },
      select: {
        id: true,
        role: true,
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (membership === null) {
      next(workspaceAccessDeniedError());
      return;
    }

    request.workspace = {
      id: membership.workspace.id,
      name: membership.workspace.name,
      membershipId: membership.id,
      role: membership.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};

function countWorkspaceHeaders(rawHeaders: string[]): number {
  let count = 0;

  for (let index = 0; index < rawHeaders.length; index += 2) {
    if (rawHeaders[index]?.toLowerCase() === 'x-workspace-id') {
      count += 1;
    }
  }

  return count;
}

function invalidWorkspaceHeaderError(): AppError {
  return new AppError({
    statusCode: 400,
    message: 'The workspace identifier is invalid.',
    code: 'INVALID_WORKSPACE_HEADER',
  });
}

function workspaceAccessDeniedError(): AppError {
  return new AppError({
    statusCode: 403,
    message: 'You do not have access to this workspace.',
    code: 'WORKSPACE_ACCESS_DENIED',
  });
}
