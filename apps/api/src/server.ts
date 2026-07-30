import process from 'node:process';
import type { Server } from 'node:http';

import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

const serviceName = 'clientflow-api';
const shutdownTimeoutMilliseconds = 10_000;
const localHealthHost =
  env.apiHost === '0.0.0.0' ? '127.0.0.1' : env.apiHost === '::' ? '::1' : env.apiHost;
let isShuttingDown = false;
let server: Server | undefined;

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    if (isShuttingDown) {
      await disconnectDatabase();
      return;
    }

    server = app.listen(env.apiPort, env.apiHost, () => {
      process.stdout.write(
        `${serviceName} (${env.nodeEnv}) listening on ${env.apiHost}:${env.apiPort}\n`,
      );
      process.stdout.write(
        `Local health check: http://${formatHostForUrl(localHealthHost)}:${env.apiPort}/health\n`,
      );
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      void handleServerError(error);
    });
  } catch {
    process.stderr.write(`${serviceName} could not start: database connection failed.\n`);
    process.exitCode = 1;

    try {
      await disconnectDatabase();
    } catch {
      process.stderr.write(`${serviceName} database cleanup failed after startup error.\n`);
    }
  }
}

async function handleServerError(error: NodeJS.ErrnoException): Promise<void> {
  if (error.code === 'EADDRINUSE') {
    process.stderr.write(
      `${serviceName} could not start: ${env.apiHost}:${env.apiPort} is already in use.\n`,
    );
  } else {
    process.stderr.write(`${serviceName} encountered an HTTP server error.\n`);
  }

  isShuttingDown = true;
  process.exitCode = 1;

  try {
    await disconnectDatabase();
  } catch {
    process.stderr.write(`${serviceName} database cleanup failed after server error.\n`);
  }
}

async function shutDown(signal: NodeJS.Signals): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  process.stdout.write(`${serviceName} received ${signal}; shutting down.\n`);

  const forcedShutdown = setTimeout(() => {
    process.stderr.write(`${serviceName} forced shutdown after 10 seconds.\n`);
    server?.closeAllConnections();
    process.exit(1);
  }, shutdownTimeoutMilliseconds);
  forcedShutdown.unref();

  try {
    if (server !== undefined) {
      await closeHttpServer(server);
    }

    await disconnectDatabase();

    process.stdout.write(`${serviceName} stopped.\n`);
    process.exitCode = 0;
  } catch {
    process.stderr.write(`${serviceName} shutdown cleanup failed.\n`);
    process.exitCode = 1;
  } finally {
    clearTimeout(forcedShutdown);
  }
}

process.once('SIGINT', () => {
  void shutDown('SIGINT');
});

process.once('SIGTERM', () => {
  void shutDown('SIGTERM');
});

function formatHostForUrl(host: string): string {
  return host.includes(':') ? `[${host}]` : host;
}

function closeHttpServer(httpServer: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    httpServer.close((error) => {
      if (error !== undefined) {
        reject(error);
        return;
      }

      resolve();
    });
    httpServer.closeIdleConnections();
  });
}

void startServer();
