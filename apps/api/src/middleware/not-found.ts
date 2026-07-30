import type { RequestHandler } from 'express';

import { AppError } from '../errors/app-error.js';

export const notFound: RequestHandler = (_request, _response, next) => {
  next(
    new AppError({
      statusCode: 404,
      message: 'Route not found',
      code: 'ROUTE_NOT_FOUND',
    }),
  );
};
