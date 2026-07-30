# ClientFlow API

The ClientFlow API is an Express 5 application written in strict TypeScript. Its current foundation
provides security headers, configurable CORS, bounded request-body parsing, a health route,
structured error responses, Prisma ORM with PostgreSQL, and graceful HTTP/database shutdown.

Authentication, authorization, and business routes are not implemented yet.

## Configuration

The API loads `.env` values with `dotenv` and validates them before startup. Development has safe
local defaults. Non-development environments must provide `DATABASE_URL`.

| Variable       | Development default                                            | Description                                     |
| -------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| `NODE_ENV`     | `development`                                                  | `development`, `test`, or `production`          |
| `API_HOST`     | `0.0.0.0`                                                      | Network interface used by the HTTP server       |
| `API_PORT`     | `4000`                                                         | HTTP port from `1` through `65535`              |
| `CORS_ORIGIN`  | `http://localhost:3000`                                        | One origin or a comma-separated list of origins |
| `DATABASE_URL` | `postgresql://clientflow:clientflow@localhost:5432/clientflow` | PostgreSQL connection string                    |

Whitespace around CORS origins is removed. Requests without an `Origin` header, including health
checks and server-to-server requests, are accepted. Browser requests from unconfigured origins
receive a structured `403` response.

`DATABASE_URL` accepts the `postgresql://` and `postgres://` protocols. Commands running on the
host connect through `localhost`; Docker Compose supplies a URL using the `postgres` service
hostname. Connection strings are never written to startup logs.

## Commands

From the repository root:

```bash
pnpm --filter @clientflow/api dev
pnpm --filter @clientflow/api typecheck
pnpm --filter @clientflow/api lint
pnpm --filter @clientflow/api build
pnpm --filter @clientflow/api start
pnpm --filter @clientflow/api clean
pnpm --filter @clientflow/api db:generate
pnpm --filter @clientflow/api db:validate
pnpm --filter @clientflow/api db:format
pnpm --filter @clientflow/api db:migrate
pnpm --filter @clientflow/api db:migrate:deploy
pnpm --filter @clientflow/api db:migrate:status
pnpm --filter @clientflow/api db:seed
pnpm --filter @clientflow/api db:studio
```

`dev` uses Node's watch mode with the `tsx` TypeScript import hook. `start` runs the compiled
`dist/server.js` output and requires `build` to have completed first. Prisma Client is generated
before development, type checking, and builds.

## Prisma and migrations

Prisma configuration is in `prisma.config.ts`, the schema and committed migrations are under
`prisma`, and generated client code is written to `src/generated/prisma`. Generated code is ignored
by Git and must not be edited.

The initial schema has only:

- `User`, with a unique email and required password hash
- `Workspace`
- `Membership`, linking users and workspaces with `OWNER`, `ADMIN`, or `MEMBER`

Create development migrations with `db:migrate`; apply committed migrations in Docker or
deployment-style environments with `db:migrate:deploy`. Docker Compose runs a one-shot migration
service before starting the API. It does not seed automatically.

The explicit, idempotent `db:seed` command creates Demo User, Demo Workspace, and their owner
membership. The demo user's password hash is intentionally non-authenticatable, so the user cannot
log in until authentication is implemented.

## Health endpoint

The API connects to PostgreSQL and verifies it with `SELECT 1` before opening the HTTP listener.
Startup fails if PostgreSQL is unavailable. `GET /health` repeats a lightweight readiness query:

```json
{
  "status": "ok",
  "service": "clientflow-api",
  "environment": "development",
  "database": "connected",
  "timestamp": "2026-07-30T00:00:00.000Z",
  "uptime": 120.5
}
```

When PostgreSQL is unavailable, the endpoint returns HTTP `503`, reports the database as
`unavailable`, and includes the code `DATABASE_UNAVAILABLE`.

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

CORS allows `GET`, `HEAD`, `PUT`, `PATCH`, `POST`, `DELETE`, `OPTIONS`, and `QUERY`. There is no
business `QUERY` route.
