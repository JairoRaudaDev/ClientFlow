import type { RequestHandler } from 'express';

import { checkDatabaseConnection } from '../config/database.js';
import { env } from '../config/env.js';

export const getHealth: RequestHandler = async (_request, response) => {
  const healthDetails = {
    service: 'clientflow-api',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  try {
    await checkDatabaseConnection();

    response.status(200).json({
      status: 'ok',
      ...healthDetails,
      database: 'connected',
    });
  } catch {
    response.status(503).json({
      status: 'error',
      ...healthDetails,
      database: 'unavailable',
      code: 'DATABASE_UNAVAILABLE',
    });
  }
};
