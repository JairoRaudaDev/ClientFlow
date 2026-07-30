// Temporary development server. Replace this file when Express is initialized.
import { Buffer } from 'node:buffer';
import { createServer } from 'node:http';
import process from 'node:process';

const host = process.env.HOST ?? '0.0.0.0';
const port = parsePort(process.env.API_PORT, 4000);
const healthResponse = JSON.stringify({
  status: 'ok',
  service: 'clientflow-api',
  placeholder: true,
});

const server = createServer((request, response) => {
  if (request.method !== 'GET' || request.url !== '/health') {
    response.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  response.writeHead(200, {
    'content-length': Buffer.byteLength(healthResponse),
    'content-type': 'application/json; charset=utf-8',
  });
  response.end(healthResponse);
});

server.listen(port, host, () => {
  process.stdout.write(`ClientFlow API placeholder listening on http://${host}:${port}\n`);
});

process.once('SIGINT', () => {
  shutDown('SIGINT');
});

process.once('SIGTERM', () => {
  shutDown('SIGTERM');
});

function parsePort(value, fallback) {
  const parsedPort = value === undefined ? fallback : Number(value);

  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65_535) {
    throw new RangeError(`API_PORT must be an integer between 1 and 65535; received "${value}".`);
  }

  return parsedPort;
}

function shutDown(signal) {
  process.stdout.write(`ClientFlow API placeholder received ${signal}; shutting down.\n`);
  server.close((error) => {
    if (error !== undefined) {
      process.stderr.write(`${error.stack ?? error.message}\n`);
      process.exitCode = 1;
    }
  });
}
