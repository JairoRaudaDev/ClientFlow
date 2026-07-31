import { Router, type RequestHandler } from 'express';

import { authenticate } from '../../middleware/authenticate.js';
import { requireWorkspace } from '../../middleware/require-workspace.js';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../../middleware/validate-request.js';
import { AppError } from '../../errors/app-error.js';
import { create, getById, list, remove, search, update } from './client.controller.js';
import {
  clientIdParamsSchema,
  clientListQuerySchema,
  clientSearchBodySchema,
  createClientBodySchema,
  updateClientBodySchema,
} from './client.schemas.js';

export const clientRouter = Router();

clientRouter.use(authenticate, requireWorkspace);

clientRouter.post('/', validateRequestBody(createClientBodySchema), create);
clientRouter.get('/', validateRequestQuery(clientListQuerySchema), list);
registerQueryRoute('/search', validateRequestBody(clientSearchBodySchema), search);
clientRouter.get('/:clientId', validateRequestParams(clientIdParamsSchema), getById);
clientRouter.patch(
  '/:clientId',
  validateRequestParams(clientIdParamsSchema),
  validateRequestBody(updateClientBodySchema),
  update,
);
clientRouter.delete('/:clientId', validateRequestParams(clientIdParamsSchema), remove);

function registerQueryRoute(path: string, ...handlers: RequestHandler[]): void {
  clientRouter.all(
    path,
    (request, _response, next) => {
      if (request.method === 'QUERY') {
        next();
        return;
      }

      next(
        new AppError({
          statusCode: 404,
          message: 'Route not found',
          code: 'ROUTE_NOT_FOUND',
        }),
      );
    },
    ...handlers,
  );
}
