# ClientFlow API

The ClientFlow API is an Express 5 application written in strict TypeScript. Its current foundation
provides security headers, configurable CORS, bounded request-body parsing, a health route,
structured error responses, and graceful process shutdown.

Database access, authentication, authorization, and business routes are not implemented yet.

## Configuration

The API loads `.env` values with `dotenv` and validates them before startup.
All variables have safe development defaults, so none are required for the default local start.

| Variable      | Default                 | Description                                     |
| ------------- | ----------------------- | ----------------------------------------------- |
| `NODE_ENV`    | `development`           | `development`, `test`, or `production`          |
| `API_HOST`    | `0.0.0.0`               | Network interface used by the HTTP server       |
| `API_PORT`    | `4000`                  | HTTP port from `1` through `65535`              |
| `CORS_ORIGIN` | `http://localhost:3000` | One origin or a comma-separated list of origins |

Whitespace around CORS origins is removed. Requests without an `Origin` header, including health
checks and server-to-server requests, are accepted. Browser requests from unconfigured origins
receive a structured `403` response.

`DATABASE_URL` may be present in Docker Compose, but this application does not read it yet.

## Commands

From the repository root:

```bash
pnpm --filter @clientflow/api dev
pnpm --filter @clientflow/api typecheck
pnpm --filter @clientflow/api lint
pnpm --filter @clientflow/api build
pnpm --filter @clientflow/api start
pnpm --filter @clientflow/api clean
```

`dev` uses Node's watch mode with the `tsx` TypeScript import hook. `start` runs the compiled
`dist/server.js` output and requires `build` to have completed first.

## Health endpoint

`GET /health` returns current process health without checking PostgreSQL:

```json
{
  "status": "ok",
  "service": "clientflow-api",
  "environment": "development",
  "timestamp": "2026-07-30T00:00:00.000Z",
  "uptime": 120.5
}
```

From the host, use `http://localhost:4000/health`. From another Compose service, use
`http://api:4000/health`.

## Request handling

Global middleware runs in this order:

1. Helmet security headers
2. CORS
3. JSON parser with a `1mb` limit
4. URL-encoded parser with a `1mb` limit
5. Application routes
6. Structured 404 middleware
7. Global error middleware

Unknown routes, invalid JSON, rejected CORS origins, oversized bodies, and unexpected failures all
return JSON. Stack traces and internal error details are never sent to clients.
