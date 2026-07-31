import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.routes.js';
import { clientRouter } from '../modules/clients/client.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/clients', clientRouter);
