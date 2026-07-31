import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { AppError } from '../errors/app-error.js';

export function validateRequestBody(schema: ZodType): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      next(
        new AppError({
          statusCode: 422,
          message: 'The request contains invalid data',
          code: 'VALIDATION_ERROR',
          details: result.error.issues.map((issue) => ({
            field: issue.path.map(String).join('.') || 'body',
            message: issue.message,
          })),
        }),
      );
      return;
    }

    request.body = result.data;
    next();
  };
}
