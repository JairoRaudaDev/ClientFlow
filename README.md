# ClientFlow

ClientFlow is a planned full-stack CRM for freelancers and small agencies. This repository
currently provides the monorepo and local development foundation for the future Next.js
frontend, Express API, PostgreSQL database, and shared TypeScript packages. The API now has a
production-oriented Express foundation; database integration and authentication are intentionally
not implemented yet.

## Monorepo structure

```text
apps/
  web/       Frontend application placeholder
  api/       Express backend application
packages/
  config/    Shared TypeScript, ESLint, and Prettier configuration
  types/     Shared TypeScript types
```

## Prerequisites

- Docker with Docker Compose v2 for the containerized environment
- Node.js 24 and pnpm 10.33.2 for running workspace commands directly on the host

## Docker development environment

Start the web placeholder, Express API, and PostgreSQL with one command:

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
PostgreSQL is available at `postgres:5432` from another container. The current `DATABASE_URL`
therefore uses `postgres`; a future API process running directly on the host would use
`localhost`.

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

Workspace packages consume reusable code-quality defaults from
`@clientflow/config`. The web framework will be added when that application is initialized.

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

API runtime variables are `NODE_ENV`, `API_HOST`, `API_PORT`, and `CORS_ORIGIN`. `CORS_ORIGIN`
accepts one origin or a comma-separated list, for example
`http://localhost:3000,http://localhost:3001`. See `.env.example` for defaults and
[`apps/api/README.md`](apps/api/README.md) for API scripts, responses, and configuration details.

The web application remains a temporary built-in Node.js placeholder. The API does not connect to
PostgreSQL and does not include authentication or business modules yet.
