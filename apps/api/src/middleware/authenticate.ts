import type { RequestHandler } from 'express';

import { AppError } from '../errors/app-error.js';
import { getCurrentUserAuthContext } from '../modules/auth/auth.service.js';
import { AccessTokenExpiredError, verifyAccessToken } from '../services/jwt.service.js';

export const authenticate: RequestHandler = async (request, _response, next) => {
  const authorizationHeaderCount = countAuthorizationHeaders(request.rawHeaders);
  const authorization = request.headers.authorization;

  if (authorizationHeaderCount === 0 || authorization === undefined) {
    next(
      new AppError({
        statusCode: 401,
        message: 'Authentication is required',
        code: 'AUTHENTICATION_REQUIRED',
      }),
    );
    return;
  }

  const match = authorizationHeaderCount === 1 ? /^Bearer ([^\s]+)$/i.exec(authorization) : null;

  if (match === null) {
    next(
      new AppError({
        statusCode: 401,
        message: 'The Authorization header must use a single Bearer token',
        code: 'INVALID_AUTHORIZATION_HEADER',
      }),
    );
    return;
  }

  const token = match[1];

  if (token === undefined) {
    next(
      new AppError({
        statusCode: 401,
        message: 'The Authorization header must use a single Bearer token',
        code: 'INVALID_AUTHORIZATION_HEADER',
      }),
    );
    return;
  }

  let userId: string;

  try {
    ({ userId } = await verifyAccessToken(token));
  } catch (error) {
    if (error instanceof AccessTokenExpiredError) {
      next(
        new AppError({
          statusCode: 401,
          message: 'The access token has expired',
          code: 'ACCESS_TOKEN_EXPIRED',
        }),
      );
      return;
    }

    next(invalidAccessTokenError());
    return;
  }

  try {
    const authContext = await getCurrentUserAuthContext(userId);

    if (authContext === null) {
      next(invalidAccessTokenError());
      return;
    }

    request.auth = authContext;
    next();
  } catch (error) {
    next(error);
  }
};

function countAuthorizationHeaders(rawHeaders: string[]): number {
  let count = 0;

  for (let index = 0; index < rawHeaders.length; index += 2) {
    if (rawHeaders[index]?.toLowerCase() === 'authorization') {
      count += 1;
    }
  }

  return count;
}

function invalidAccessTokenError(): AppError {
  return new AppError({
    statusCode: 401,
    message: 'The access token is invalid',
    code: 'INVALID_ACCESS_TOKEN',
  });
}
