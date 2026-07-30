// Temporary development server. Replace this file when Next.js is initialized.
import { Buffer } from 'node:buffer';
import { createServer } from 'node:http';
import process from 'node:process';

const host = process.env.HOST ?? '0.0.0.0';
const port = parsePort(process.env.WEB_PORT, 3000);
const responseBody = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ClientFlow</title>
  </head>
  <body>
    <main>
      <h1>ClientFlow web placeholder</h1>
      <p>The Next.js application has not been initialized yet.</p>
    </main>
  </body>
</html>
`;

const server = createServer((request, response) => {
  if (request.method !== 'GET' || request.url !== '/') {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found\n');
    return;
  }

  response.writeHead(200, {
    'content-length': Buffer.byteLength(responseBody),
    'content-type': 'text/html; charset=utf-8',
  });
  response.end(responseBody);
});

server.listen(port, host, () => {
  process.stdout.write(`ClientFlow web placeholder listening on http://${host}:${port}\n`);
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
    throw new RangeError(`WEB_PORT must be an integer between 1 and 65535; received "${value}".`);
  }

  return parsedPort;
}

function shutDown(signal) {
  process.stdout.write(`ClientFlow web placeholder received ${signal}; shutting down.\n`);
  server.close((error) => {
    if (error !== undefined) {
      process.stderr.write(`${error.stack ?? error.message}\n`);
      process.exitCode = 1;
    }
  });
}
