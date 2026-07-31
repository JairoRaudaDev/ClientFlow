import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';
import { AppError } from './errors/app-error.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { apiRouter } from './routes/index.js';

export const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (origin === undefined || env.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(
        new AppError({
          statusCode: 403,
          message: 'Origin is not allowed by the CORS policy',
          code: 'CORS_ORIGIN_NOT_ALLOWED',
        }),
      );
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS', 'QUERY'],
    allowedHeaders: ['Authorization', 'Content-Type', 'X-Workspace-Id'],
    credentials: false,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb', parameterLimit: 1000 }));

app.use(apiRouter);

app.use(notFound);
app.use(errorHandler);
