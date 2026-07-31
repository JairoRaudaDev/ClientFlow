import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { AppError } from '../errors/app-error.js';

type RequestLocation = 'body' | 'params' | 'query';

export function validateRequestBody(schema: ZodType): RequestHandler {
  return validateRequest(schema, 'body');
}

export function validateRequestParams(schema: ZodType): RequestHandler {
  return validateRequest(schema, 'params');
}

export function validateRequestQuery(schema: ZodType): RequestHandler {
  return validateRequest(schema, 'query');
}

function validateRequest(schema: ZodType, location: RequestLocation): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request[location]);

    if (!result.success) {
      next(
        new AppError({
          statusCode: 422,
          message: 'The request contains invalid data',
          code: 'VALIDATION_ERROR',
          details: result.error.issues.map((issue) => ({
            field: issue.path.map(String).join('.') || location,
            message: issue.message,
          })),
        }),
      );
      return;
    }

    if (location === 'body') {
      request.body = result.data;
    }

    request.validated = {
      ...request.validated,
      [location]: result.data,
    };
    next();
  };
}
