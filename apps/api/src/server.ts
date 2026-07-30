import process from 'node:process';

import { env } from './config/env.js';
import { app } from './app.js';

const serviceName = 'clientflow-api';
const shutdownTimeoutMilliseconds = 10_000;
const localHealthHost =
  env.apiHost === '0.0.0.0' ? '127.0.0.1' : env.apiHost === '::' ? '::1' : env.apiHost;
let isShuttingDown = false;

const server = app.listen(env.apiPort, env.apiHost, () => {
  process.stdout.write(
    `${serviceName} (${env.nodeEnv}) listening on ${env.apiHost}:${env.apiPort}\n`,
  );
  process.stdout.write(
    `Local health check: http://${formatHostForUrl(localHealthHost)}:${env.apiPort}/health\n`,
  );
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    process.stderr.write(
      `${serviceName} could not start: ${env.apiHost}:${env.apiPort} is already in use.\n`,
    );
  } else {
    process.stderr.write(`${serviceName} server error: ${error.stack ?? error.message}\n`);
  }

  process.exitCode = 1;
});

function shutDown(signal: NodeJS.Signals): void {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  process.stdout.write(`${serviceName} received ${signal}; shutting down.\n`);

  const forcedShutdown = setTimeout(() => {
    process.stderr.write(`${serviceName} forced shutdown after 10 seconds.\n`);
    server.closeAllConnections();
    process.exit(1);
  }, shutdownTimeoutMilliseconds);
  forcedShutdown.unref();

  server.close((error) => {
    clearTimeout(forcedShutdown);

    if (error !== undefined) {
      process.stderr.write(`${serviceName} shutdown error: ${error.stack ?? error.message}\n`);
      process.exitCode = 1;
      return;
    }

    process.stdout.write(`${serviceName} stopped.\n`);
    process.exitCode = 0;
  });

  server.closeIdleConnections();
}

process.once('SIGINT', () => {
  shutDown('SIGINT');
});

process.once('SIGTERM', () => {
  shutDown('SIGTERM');
});

function formatHostForUrl(host: string): string {
  return host.includes(':') ? `[${host}]` : host;
}
