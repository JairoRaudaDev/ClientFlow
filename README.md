# ClientFlow

ClientFlow is a planned full-stack CRM for freelancers and small agencies. This repository
provides the monorepo and local development foundation for the Next.js frontend, Express API,
PostgreSQL database, and shared TypeScript packages. The API has a production-oriented Express
foundation, Prisma-backed database connection, and JWT access-token authentication. The web
application has an initial Next.js App Router layout and routing structure. Business endpoints
and frontend business functionality are intentionally not implemented yet.

## Monorepo structure

```text
apps/
  web/       Next.js frontend application
  api/       Express backend application
packages/
  config/    Shared TypeScript, ESLint, and Prettier configuration
  types/     Shared TypeScript types
```

## Prerequisites

- Docker with Docker Compose v2 for the containerized environment
- Node.js 24 and pnpm 10.33.2 for running workspace commands directly on the host

## Docker development environment

Start the Next.js web app, Express API, and PostgreSQL with one command:

```bash
docker compose up --build
```

The default local endpoints are:

- Web: `http://localhost:3000`
- API health check: `http://localhost:4000/health`
- PostgreSQL: `localhost:5432`

Compose uses safe local defaults, so creating a `.env` file is optional. To customize ports or
database credentials, copy `.env.example` to `.env` and edit the development values. From the
host, browser and command-line clients use `localhost`. Containers communicate over the shared
Docker network by service name, so the API health endpoint is `http://api:4000/health` and
PostgreSQL is available at `postgres:5432` from another container.

On startup, the one-shot `migrate` service waits for PostgreSQL to become healthy and applies the
committed migrations with `prisma migrate deploy`. The API starts only after migrations complete
successfully. Compose builds the container-only database URL from the PostgreSQL variables and the
`postgres` hostname; `.env.example` uses `localhost` for commands run directly on the host. Docker
startup does not run the development seed.

Stop the environment while preserving the PostgreSQL data volume:

```bash
docker compose down
```

Use `docker compose down --volumes` only when you intentionally want to remove the local database
data.

## Installation

```bash
pnpm install
```

## Root scripts

- `pnpm dev` runs development tasks across the workspace.
- `pnpm build` builds workspace packages.
- `pnpm lint` runs workspace lint tasks.
- `pnpm typecheck` runs workspace TypeScript checks.
- `pnpm format` formats supported workspace files with Prettier.
- `pnpm format:check` verifies workspace formatting without changing files.
- `pnpm clean` removes generated workspace output.
- `pnpm db:generate` generates the API's Prisma Client.
- `pnpm db:validate` validates the Prisma schema and configuration.
- `pnpm db:format` formats the Prisma schema.
- `pnpm db:migrate` creates or applies development migrations.
- `pnpm db:migrate:deploy` applies committed migrations without development prompts.
- `pnpm db:migrate:status` reports migration status.
- `pnpm db:seed` explicitly runs the idempotent development seed.
- `pnpm db:studio` opens Prisma Studio.

Workspace packages consume reusable code-quality defaults from `@clientflow/config`.

## Web

The web application is a Next.js App Router project using TypeScript and Tailwind CSS. It listens
on port `3000` and host `0.0.0.0` by default.

Run only the web application in development:

```bash
pnpm --filter @clientflow/web dev
```

Build and run the compiled application:

```bash
pnpm --filter @clientflow/web build
pnpm --filter @clientflow/web start
```

Lint and type-check the workspace directly:

```bash
pnpm --filter @clientflow/web lint
pnpm --filter @clientflow/web typecheck
```

`src/app` is organized into three route groups that share visual layouts without changing public
URLs:

- `(marketing)` — public routes: `/` and `/pricing`
- `(auth)` — focused authentication routes: `/login` and `/register`
- `(workspace)` — the application shell: `/dashboard`, `/clients`, `/projects`, and `/settings`

The login and register pages are working forms wired to the API:

- `/register` and `/login` validate input client-side with Zod, call `POST /auth/register` and
  `POST /auth/login`, show field-level and form-level errors, and provide loading/disabled states
  that prevent duplicate submissions.
- On success, both forms store only the returned access token in `sessionStorage`
  (`clientflow.accessToken`) and redirect to `/dashboard` with `router.replace`.
- The workspace routes are still not protected and are not redirected based on authentication
  state. Anyone can currently reach `/dashboard`, `/clients`, `/projects`, and `/settings`.
- The dashboard, clients, projects, and settings pages are structural placeholders with empty
  states. They render no client, project, or business data, and the application does not yet
  hydrate the authenticated user from `/auth/me` or reflect a signed-in state anywhere in the
  shell.
- Session hydration, route protection, token-expiration handling, and logout are deferred to the
  next authentication-session change. See [Authentication](#authentication) for the current
  limitations.

Client/project CRUD and billing will be added in later changes.

The browser-accessible API base URL is configured with:

```text
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Set it in `.env` (or the environment) before building or running the web application. The web
client falls back to `http://localhost:4000` when the variable is absent, which is only correct
for local development. Production deployments must set `NEXT_PUBLIC_API_URL` to the API's real
public URL — the value is inlined into the browser bundle, so it must never carry secrets.

## API

The API foundation includes Express, Helmet security headers, configurable CORS, size-limited JSON
and URL-encoded body parsing, modular routing, structured JSON errors, and graceful shutdown. It
listens on port `4000` and host `0.0.0.0` by default.

Run only the API in development:

```bash
pnpm --filter @clientflow/api dev
```

Build and run the compiled API:

```bash
pnpm --filter @clientflow/api build
pnpm --filter @clientflow/api start
```

API runtime variables are `NODE_ENV`, `API_HOST`, `API_PORT`, `CORS_ORIGIN`, `DATABASE_URL`,
`JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE`, and `JWT_ACCESS_TOKEN_TTL`. `CORS_ORIGIN` accepts one
origin or a comma-separated list, for example `http://localhost:3000,http://localhost:3001`. See
`.env.example` for defaults and [`apps/api/README.md`](apps/api/README.md) for API scripts,
responses, and configuration details.

## Authentication

The API supports:

- `POST /auth/register` to create a user, a workspace, and an `OWNER` membership atomically
- `POST /auth/login` to verify credentials and issue an access token
- `GET /auth/me` to return the current user and database-backed memberships

Registration and login return a short-lived JWT access token. Send it to protected endpoints using
`Authorization: Bearer <access-token>`. For example:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@clientflow.local","password":"ClientFlowDemo123!"}'
```

Create the local demo account explicitly:

```bash
pnpm db:seed
```

The development-only credentials are `demo@clientflow.local` / `ClientFlowDemo123!`. Override the
password with `SEED_USER_PASSWORD` when needed. These credentials and all `.env.example` secrets
are local defaults only.

Access tokens are currently short-lived. Refresh tokens are not implemented, logout is client-side
token removal, and API rate limiting will be added in a later security change. See
[`apps/api/README.md`](apps/api/README.md) for request and response examples and the complete
authentication error list.

The web application's `/register` and `/login` pages call these endpoints directly from the
browser and store only the access token, temporarily, in `sessionStorage`. This is intentionally
minimal:

- Routes are not protected yet — reaching `/dashboard` does not require a token.
- The application does not hydrate the current user or call `/auth/me` on startup.
- Logout is not implemented; there is no way to clear the stored token from the UI yet.
- Access-token expiration is not handled — an expired token is not detected or refreshed.
- Refresh tokens, token rotation, and token revocation are not implemented.

These will be addressed in the next authentication-session commit.

## Database

Prisma ORM is owned by `apps/api`. Its initial schema contains `User`, `Workspace`, and
`Membership`, with `OWNER`, `ADMIN`, and `MEMBER` membership roles. A user may belong to multiple
workspaces, and each user/workspace pair is unique. Client and project models will be added in
later work.

The generated Prisma Client is written to `apps/api/src/generated/prisma`, is ignored by Git, and
is regenerated automatically before API development, type checking, and builds. After editing
`apps/api/prisma/schema.prisma`, format and validate it, then create a migration:

```bash
pnpm db:format
pnpm db:validate
pnpm db:migrate -- --name descriptive_migration_name
```

Apply committed migrations in deployment-style environments with:

```bash
pnpm db:migrate:deploy
```

Run the deterministic development seed explicitly and inspect data with Prisma Studio:

```bash
pnpm db:seed
pnpm db:studio
```

The seed creates or updates one authenticatable demo user, one demo workspace, and one owner
membership. It uses the same versioned asynchronous scrypt password hashing as registration.

The web application's authentication UI stores only a short-lived access token in `sessionStorage`
and does not yet enforce sessions or protect routes. Workspace authorization, client/project CRUD,
and billing are not implemented.
