import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate.js';
import { validateRequestBody } from '../../middleware/validate-request.js';
import { getMe, login, register } from './auth.controller.js';
import { loginBodySchema, registerBodySchema } from './auth.schemas.js';

export const authRouter = Router();

authRouter.post('/register', validateRequestBody(registerBodySchema), register);
authRouter.post('/login', validateRequestBody(loginBodySchema), login);
authRouter.get('/me', authenticate, getMe);
