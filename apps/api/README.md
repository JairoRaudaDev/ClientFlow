# ClientFlow API

The ClientFlow API is an Express 5 application written in strict TypeScript. Its current foundation
provides security headers, configurable CORS, bounded request-body parsing, a health route,
structured error responses, Prisma ORM with PostgreSQL, JWT access-token authentication, and
graceful HTTP/database shutdown.

Workspace authorization and business routes are not implemented yet.

## Configuration

The API loads `.env` values with `dotenv` and validates them before startup. Development has safe
local defaults. Non-development environments must provide `DATABASE_URL`.

| Variable               | Development default                                            | Description                                     |
| ---------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| `NODE_ENV`             | `development`                                                  | `development`, `test`, or `production`          |
| `API_HOST`             | `0.0.0.0`                                                      | Network interface used by the HTTP server       |
| `API_PORT`             | `4000`                                                         | HTTP port from `1` through `65535`              |
| `CORS_ORIGIN`          | `http://localhost:3000`                                        | One origin or a comma-separated list of origins |
| `DATABASE_URL`         | `postgresql://clientflow:clientflow@localhost:5432/clientflow` | PostgreSQL connection string                    |
| `JWT_SECRET`           | Local-only fallback                                            | HS256 secret, at least 32 characters            |
| `JWT_ISSUER`           | `clientflow-api`                                               | Required JWT issuer claim                       |
| `JWT_AUDIENCE`         | `clientflow-web`                                               | Required JWT audience claim                     |
| `JWT_ACCESS_TOKEN_TTL` | `1h`                                                           | Positive duration using `s`, `m`, `h`, or `d`   |
| `SEED_USER_PASSWORD`   | `ClientFlowDemo123!`                                           | Development-only password for the explicit seed |

Whitespace around CORS origins is removed. Requests without an `Origin` header, including health
checks and server-to-server requests, are accepted. Browser requests from unconfigured origins
receive a structured `403` response.

`DATABASE_URL` accepts the `postgresql://` and `postgres://` protocols. Commands running on the
host connect through `localhost`; Docker Compose supplies a URL using the `postgres` service
hostname. Connection strings are never written to startup logs.

Production requires both `DATABASE_URL` and `JWT_SECRET`. The JWT secret is never logged. The
development defaults are not production credentials.

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

The explicit, idempotent `db:seed` command creates or updates Demo User, Demo Workspace, and their
owner membership. It does not run during API or Docker startup. The local-only demo credentials
are:

```text
Email: demo@clientflow.local
Password: ClientFlowDemo123!
```

Set `SEED_USER_PASSWORD` before running the seed to override the password. Passwords are stored
using the same versioned asynchronous scrypt format used by registration.

## Authentication

Registration and login return a short-lived HS256 access token. The signed claims include `sub`,
`iss`, `aud`, `iat`, `exp`, `jti`, and `tokenType: "access"`. The payload does not contain email,
name, workspace, or role data. Memberships are loaded from PostgreSQL on authenticated requests.

### Register

`POST /auth/register` accepts a strict JSON body:

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jairo Rauda",
    "email": "jairo@example.com",
    "password": "secure-password",
    "workspaceName": "Jairo Studio"
  }'
```

`workspaceName` is optional; the API derives a workspace name from the user's name when omitted.
The user, workspace, and `OWNER` membership are created atomically. A successful request returns
HTTP `201`:

```json
{
  "success": true,
  "data": {
    "accessToken": "<access-token>",
    "tokenType": "Bearer",
    "expiresIn": "1h",
    "user": {
      "id": "<uuid>",
      "name": "Jairo Rauda",
      "email": "jairo@example.com",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    },
    "memberships": [
      {
        "id": "<uuid>",
        "role": "OWNER",
        "workspace": {
          "id": "<uuid>",
          "name": "Jairo Studio",
          "createdAt": "<timestamp>",
          "updatedAt": "<timestamp>"
        }
      }
    ]
  }
}
```

### Login

`POST /auth/login` accepts:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jairo@example.com","password":"secure-password"}'
```

A successful request returns HTTP `200` and the same authentication data as registration. Unknown
emails and incorrect passwords both return `INVALID_CREDENTIALS`.

### Current user

Send the access token only through the standard Authorization header:

```bash
curl http://localhost:4000/auth/me \
  -H "Authorization: Bearer <access-token>"
```

A successful request returns HTTP `200` without issuing another token:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "<uuid>",
      "name": "Jairo Rauda",
      "email": "jairo@example.com",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    },
    "memberships": [
      {
        "id": "<uuid>",
        "role": "OWNER",
        "workspace": {
          "id": "<uuid>",
          "name": "Jairo Studio",
          "createdAt": "<timestamp>",
          "updatedAt": "<timestamp>"
        }
      }
    ]
  }
}
```

Tokens in query parameters, request bodies, cookies, or custom headers are not accepted.

### Authentication errors

Errors use the existing `{ "success": false, "message": "...", "code": "..." }` shape.
Validation errors additionally contain safe `field` and `message` details.

| Status | Code                           | Meaning                                           |
| -----: | ------------------------------ | ------------------------------------------------- |
|    422 | `VALIDATION_ERROR`             | The strict request body is invalid                |
|    409 | `EMAIL_ALREADY_REGISTERED`     | Registration conflicts with an existing email     |
|    401 | `INVALID_CREDENTIALS`          | Login email or password is invalid                |
|    401 | `AUTHENTICATION_REQUIRED`      | The Authorization header is missing               |
|    401 | `INVALID_AUTHORIZATION_HEADER` | The header is not exactly one Bearer token        |
|    401 | `INVALID_ACCESS_TOKEN`         | Signature, claims, token type, or user is invalid |
|    401 | `ACCESS_TOKEN_EXPIRED`         | The token expiration time has passed              |

Access tokens are currently short-lived. Refresh tokens and server-side revocation are not
implemented. Logout therefore means removing the token on the client. Rate limiting, account
lockout, email verification, password reset, and multi-factor authentication are intentionally
deferred. The API has no authentication bypass for the demo account, and the placeholder frontend
does not implement login, registration, or token storage.

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
