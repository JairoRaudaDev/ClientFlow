import type { RequestHandler } from 'express';

import { env } from '../config/env.js';

export const getHealth: RequestHandler = (_request, response) => {
  response.status(200).json({
    status: 'ok',
    service: 'clientflow-api',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
