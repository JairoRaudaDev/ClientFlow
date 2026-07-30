# ClientFlow

ClientFlow is a planned full-stack CRM for freelancers and small agencies. This repository
currently provides the monorepo and local development foundation for the future Next.js
frontend, Express API, PostgreSQL database, and shared TypeScript packages.

## Monorepo structure

```text
apps/
  web/       Frontend application placeholder
  api/       Backend application placeholder
packages/
  config/    Shared TypeScript, ESLint, and Prettier configuration
  types/     Shared TypeScript types
```

## Prerequisites

- Docker with Docker Compose v2 for the containerized environment
- Node.js 24 and pnpm 10.33.2 for running workspace commands directly on the host

## Docker development environment

Start the web placeholder, API placeholder, and PostgreSQL with one command:

```bash
docker compose up --build
```

The default local endpoints are:

- Web: `http://localhost:3000`
- API health check: `http://localhost:4000/health`
- PostgreSQL: `localhost:5432`

Compose uses safe local defaults, so creating a `.env` file is optional. To customize ports or
database credentials, copy `.env.example` to `.env` and edit the development values. The
`DATABASE_URL` uses `postgres` as its hostname because containers communicate over the shared
Docker network by service name. An application running directly on the host would normally use
`localhost` instead.

Stop the environment while preserving the PostgreSQL data volume:

```bash
docker compose down
```

Use `docker compose down --volumes` only when you intentionally want to remove the local database
data. Rebuild the affected image after source or dependency changes while the applications remain
placeholders.

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
`@clientflow/config`. Framework-specific configuration will be added when the
web and API applications are initialized.

The web and API applications use temporary built-in Node.js HTTP servers so their development
containers remain available and can be health checked. These placeholders contain no application
business logic and will be replaced when Next.js and Express are initialized.
