# ClientFlow

ClientFlow is a secure client management workspace for freelancers and small service businesses.
It keeps client information organized, searchable, and easy to maintain — without the overhead of
a larger platform. This repository is a Dockerized monorepo with a Next.js frontend, an Express
API, PostgreSQL persistence, and shared TypeScript packages.

## Implemented features

- Registration and login with hashed passwords
- JWT Bearer access-token authentication
- Session persistence across page reloads
- Protected frontend routes with client-side guards
- Workspace-scoped authorization enforced by the API
- Client CRUD (create, list, read, update, delete)
- Client search across name, company, email, and phone
- Structured HTTP `QUERY` filters for email/phone presence
- Pagination and sorting
- A dashboard backed by real client data
- A read-only account and workspace overview
- Responsive interface for desktop and mobile
- PostgreSQL storage with Prisma
- Docker Compose development environment
- Input validation and consistent, safe error responses

## Technology stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Frontend   | Next.js 16, React 19, Tailwind CSS 4             |
| API        | Express 5, Zod, Helmet, CORS                     |
| Auth       | jose (JWT), Node.js `crypto` scrypt hashing      |
| Database   | PostgreSQL via Prisma 7 and `@prisma/adapter-pg` |
| Tooling    | TypeScript 6, ESLint, Prettier, Turborepo, pnpm  |
| Runtime    | Node.js 24 (containers use `node:24-bookworm`)   |

## Monorepo structure

```text
apps/
  web/       Next.js frontend application
  api/       Express backend application
packages/
  config/    Shared TypeScript, ESLint, and Prettier configuration
  types/     Shared TypeScript types
```

## Architecture

- **Web application** (`apps/web`) uses the Next.js App Router. A session provider restores the
  access token from `sessionStorage` and revalidates it against `GET /auth/me`. An active
  workspace provider resolves the selected workspace. Workspace pages are guarded by
  `AuthenticatedRoute`, and login/registration pages are guarded by `GuestOnlyRoute`.
- **API application** (`apps/api`) is an Express 5 app. Every protected route authenticates the
  Bearer token and requires the `X-Workspace-Id` header. Data access is scoped to that workspace
  membership, so one user can never read or mutate another workspace's clients.
- **Shared packages** (`packages/`) provide the workspace-wide TypeScript, ESLint, and Prettier
  configuration.
- **PostgreSQL** persists users, workspaces, memberships, and clients. Migrations are applied by
  the one-shot `migrate` service.
- **Docker Compose** runs the web app, the API, and PostgreSQL on an internal network with health
  checks.

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
committed migrations with `prisma migrate deploy`. The API then connects and serves requests, and
the web app is served by the Next.js development server. The database is stored in a named volume,
so it survives `docker compose down` (it is only removed by an explicit `docker compose down -v`).

To stop the environment while keeping the data volume:

```bash
docker compose down
```

## Environment variables

See `.env.example` for the full list with comments. The most important values are:

| Variable              | Development default                                                       | Description                               |
| --------------------- | ------------------------------------------------------------------------- | ----------------------------------------- |
| `WEB_PORT`            | `3000`                                                                    | Port published for the web app            |
| `API_PORT`            | `4000`                                                                    | Port published for the API                |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000`                                                   | Browser-accessible API base URL           |
| `CORS_ORIGIN`         | `http://localhost:3000`                                                   | Allowed browser origins (comma-separated) |
| `DATABASE_URL`        | `postgresql://clientflow:clientflow@127.0.0.1:5432/clientflow`            | PostgreSQL connection string              |
| `JWT_SECRET`          | Local-only fallback                                                       | HS256 secret, at least 32 characters      |
| `JWT_ISSUER`          | `clientflow-api`                                                          | Required JWT issuer claim                 |
| `JWT_AUDIENCE`        | `clientflow-web`                                                          | Required JWT audience claim               |
| `JWT_ACCESS_TOKEN_TTL`| `1h`                                                                      | Access-token lifetime                     |
| `SEED_USER_PASSWORD`  | `ClientFlowDemo123!`                                                      | Development demo account password         |

Never commit real secrets or `.env` files. Production deployments must supply a strong `JWT_SECRET`
and the API's real public URL for `NEXT_PUBLIC_API_URL`.

## Local setup

The shortest working Docker workflow:

```bash
docker compose up --build
```

Migrations run automatically when the `migrate` service starts. To apply them manually:

```bash
pnpm db:migrate:deploy
```

To seed the database with the demo account and demo clients (development only):

```bash
pnpm db:seed
```

## Development commands

```bash
pnpm install            # install all workspace dependencies
pnpm dev                # run the API and web app in watch mode
pnpm lint               # lint every workspace package
pnpm typecheck          # type-check every workspace package
pnpm build              # build every workspace package
```

Database commands are available at the root and scoped to the API package:

```bash
pnpm db:generate        # generate the Prisma client
pnpm db:migrate         # create and apply a migration in development
pnpm db:migrate:deploy  # apply committed migrations (used by Docker)
pnpm db:migrate:status  # report migration state
pnpm db:seed            # seed the demo account and demo clients
pnpm db:studio          # open Prisma Studio
```

## Demo credentials

After seeding, log in at `http://localhost:3000/login` with:

- Email: `demo@clientflow.local`
- Password: `ClientFlowDemo123!`

The demo account owns a workspace named `Demo Workspace` and contains three fictional clients:
`Northstar Creative`, `Acme Consulting`, and `Rivera Photography`. All seed data uses fictional
contact information under the reserved `.example` domain.

## Main routes

| Route                        | Purpose                                |
| ---------------------------- | -------------------------------------- |
| `/`                          | Landing page                           |
| `/login`                     | Log in                                 |
| `/register`                  | Create an account and workspace        |
| `/dashboard`                 | Workspace dashboard (requires session) |
| `/clients`                   | Client list                            |
| `/clients/new`               | Create a client                        |
| `/clients/:clientId`         | Client details                         |
| `/clients/:clientId/edit`    | Edit a client                          |
| `/settings`                  | Account and workspace overview         |

Removed routes (such as the former `/projects` and `/pricing`) render the standard not-found
experience.

## API endpoints

| Method   | Path                | Purpose                              |
| -------- | ------------------- | ------------------------------------ |
| `GET`    | `/health`           | Health check                         |
| `POST`   | `/auth/register`    | Create an account and workspace      |
| `POST`   | `/auth/login`       | Log in and receive an access token   |
| `GET`    | `/auth/me`          | Current user and memberships         |
| `POST`   | `/clients`          | Create a client                      |
| `GET`    | `/clients`          | List clients with search and paging  |
| `QUERY`  | `/clients/search`   | Structured read-only client search   |
| `GET`    | `/clients/:clientId`| Read one client                      |
| `PATCH`  | `/clients/:clientId`| Update a client                      |
| `DELETE` | `/clients/:clientId`| Delete a client                      |

### Workspace header

Every client request must include the active workspace:

```http
Authorization: Bearer <access-token>
X-Workspace-Id: <workspace-id>
```

The API verifies that the signed-in user is a member of the workspace before allowing any access.

### HTTP QUERY

The API accepts the non-standard `QUERY` method on `GET /clients/search` (registered as a
`QUERY` route) for structured, read-only client search. It carries filter and sort options in the
body and never modifies data. Ordinary searches use `GET /clients` with query-string parameters;
structured filters (such as email/phone presence) use `QUERY /clients/search`. The browser's
preflight must allow `QUERY` together with `Authorization`, `Content-Type`, and `X-Workspace-Id`.

## Security notes

- Passwords are hashed with `scrypt` using a per-user salt and constant-time comparison.
- Access tokens are short-lived JWTs signed with HS256, verified against issuer, audience, and
  algorithm claims.
- Client queries are always scoped to the authenticated user's workspace membership, blocking
  cross-workspace access.
- API responses map entities to explicit public shapes; internal fields (such as password hashes)
  are never returned.
- The web app guards protected routes client-side and redirects unauthenticated users to login,
  but the API remains the real security boundary.
- The access token and the active workspace ID are kept in `sessionStorage` for the current tab
  only. No client data is stored in browser storage.
- There are no refresh tokens yet; the access token has a single fixed lifetime.

## Current limitations

These are intentional MVP boundaries, not broken features:

- No project management
- No billing or subscriptions
- No team invitations or workspace administration
- No password reset or email verification
- No refresh-token rotation

## Future improvements

Possible directions, not commitments:

- Refresh-token rotation for longer-lived sessions
- Automated integration tests
- Role-specific permissions within a workspace
- Audit history for client changes
- A production deployment pipeline

## Validation

Run the checks relevant to a change before committing:

```bash
pnpm lint
pnpm typecheck
pnpm build
docker compose config
```
