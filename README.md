# ClientFlow

ClientFlow is a planned full-stack CRM for freelancers and small agencies. This repository
provides the monorepo and local development foundation for the Next.js frontend, Express API,
PostgreSQL database, and shared TypeScript packages. The API has a production-oriented Express
foundation, Prisma-backed database connection, JWT access-token authentication, and workspace-scoped
client management endpoints. The web application has an initial Next.js App Router layout and
routing structure. Frontend business functionality is intentionally not implemented yet.

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

The login and register pages are working forms wired to the API, and the whole application now has
client-side session handling built around a central `SessionProvider`:

- `/register` and `/login` validate input client-side with Zod, call `POST /auth/register` and
  `POST /auth/login`, show field-level and form-level errors, and provide loading/disabled states
  that prevent duplicate submissions.
- On success, both forms call `startSession(...)` on the session context, which persists the
  returned access token to `sessionStorage` (`clientflow.accessToken`), populates the user and
  memberships in memory, and redirects with `router.replace` to a safe post-authentication
  destination (see [Authentication](#authentication)).
- `/dashboard`, `/clients`, `/projects`, and `/settings` are protected: an `AuthenticatedRoute`
  guard shows a session-checking state, then either renders the workspace shell or redirects
  unauthenticated visitors to `/login` with the original destination preserved.
- `/login` and `/register` are guest-only: a `GuestOnlyRoute` guard redirects an already
  authenticated visitor away to the dashboard or the requested destination instead of showing the
  form again.
- The dashboard, projects, and settings pages are still structural placeholders with empty
  states. They render no project or business data.
- `/clients` is a working client-management interface. See
  [Client management](#client-management) below.

Project CRUD and billing will be added in later changes.

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

### Client-side session handling

The web application's `/register` and `/login` pages call these endpoints directly from the
browser, and a central `SessionProvider` (mounted in `apps/web/src/app/providers.tsx`, inside the
root layout) owns all client-side session state:

- **Session state model.** The session context exposes a `status` of `initializing`,
  `authenticated`, `unauthenticated`, or `error`, plus the current user, memberships, access token,
  and an `endReason` of `expired`, `invalid`, `logged-out`, or `null`. Initial state is always
  `initializing` on both the server-rendered and client-hydrated markup — `sessionStorage` is only
  inspected after mount, so there is no hydration mismatch.
- **Hydration through `/auth/me`.** On mount, if a token exists in `sessionStorage`
  (`clientflow.accessToken`), the provider calls `GET /auth/me` with
  `Authorization: Bearer <access-token>` to validate it and load the current user and
  database-backed memberships. A missing token goes straight to `unauthenticated` without calling
  the API.
- **Failure classification.** `ACCESS_TOKEN_EXPIRED`, `INVALID_ACCESS_TOKEN`,
  `AUTHENTICATION_REQUIRED`, and `INVALID_AUTHORIZATION_HEADER` responses clear the stored token
  and mark the session `unauthenticated` with `endReason: 'expired'` or `'invalid'`. Network
  errors, timeouts, 5xx responses, and malformed responses do **not** clear the token — they set
  `status: 'error'` and preserve the token so a temporary outage cannot silently sign someone out.
- **Protected workspace routes.** `/dashboard`, `/clients`, `/projects`, and `/settings` are wrapped
  in an `AuthenticatedRoute` Client Component. It shows a session-checking state while
  `initializing`, a recoverable error state (with Retry and Sign out) while `error`, and only
  renders the workspace shell once `authenticated`. Unauthenticated visitors are redirected with
  `router.replace` to `/login?next=<path>`, with `reason=session-expired` or `reason=session-invalid`
  appended when applicable. There is no protected-content flash.
- **Guest-only auth routes.** `/login` and `/register` are wrapped in a `GuestOnlyRoute` Client
  Component that redirects an already authenticated visitor to the sanitized destination (or
  `/dashboard`) instead of showing the form.
- **Safe redirects only.** The `next` query parameter is never trusted directly. It is checked
  against an allowlist of internal workspace routes (`/dashboard`, `/clients`, `/projects`,
  `/settings`, and their nested paths); anything else — absolute URLs, protocol-relative URLs,
  `javascript:` URLs, backslash tricks, `/login`, `/register`, or unknown paths — falls back to
  `/dashboard`. This prevents an open redirect.
- **Logout.** The application shell shows the signed-in user's name and email with a Log out
  button. Logout clears `sessionStorage` and in-memory session state and navigates to
  `/login?reason=logged-out`. There is currently no backend logout endpoint — logout only removes
  the client-side token; the JWT itself is not revoked.
- **Revalidation.** The session is revalidated on initial hydration, on an explicit retry from the
  error state, and when an authenticated tab regains visibility after being inactive, throttled to
  at most once per minute. There is no polling and no background refresh-token mechanism.

Current limitations, by design:

- Refresh tokens, token rotation, and token revocation are not implemented.
- Cookies are not used; the token lives only in `sessionStorage`, scoped to the current browser
  tab. Closing the tab ends the session.
- Route guards are client-side only — they protect the UI, not the API. The Express API remains
  the sole authorization boundary and independently rejects missing, expired, or invalid tokens.
- Workspace switching and role-based frontend permissions are not implemented.

## Client management

`/clients` is a working, browser-rendered client-management interface backed directly by the
Express API's client endpoints (`POST/GET /clients`, `QUERY /clients/search`, and
`GET/PATCH/DELETE /clients/:clientId`). There is no Next.js API route or proxy in front of it —
every request is made from a Client Component using the same `sessionStorage` access token as the
rest of the authenticated app, plus an `X-Workspace-Id` header identifying the active workspace.
Client data is isolated by workspace; the API independently enforces that isolation regardless of
what the frontend sends.

### Active workspace

The API requires every client request to carry `X-Workspace-Id`, and a user can belong to more
than one workspace, so the frontend maintains an explicit "active workspace" separate from the
session:

- An `ActiveWorkspaceProvider` (mounted inside `(workspace)/layout.tsx`, below `AuthenticatedRoute`
  and above `AppShell`) derives the active workspace from the session's `memberships` list.
- With exactly one membership, that workspace is selected automatically. With more than one, a
  workspace id previously stored in `sessionStorage` (`clientflow.activeWorkspaceId`) is restored
  if it still matches a current membership; otherwise the provider enters a `selection-required`
  state and blocks client requests until the user picks one from the workspace selector in the
  application header. With zero memberships, it enters an `unavailable` state with an honest
  blocking message — no client content is requested or rendered in either case.
- Only the workspace id is stored client-side, never the full membership or workspace object, and
  it is cleared when the provider unmounts (i.e., on logout or leaving the workspace route group).
- Switching workspaces from the selector persists the new id, clears in-memory client data, resets
  the client list back to page 1, and refetches for the newly selected workspace.
- If any client request returns `WORKSPACE_ACCESS_DENIED`, the frontend clears the stored
  workspace id, re-evaluates the user's remaining memberships, and shows a safe "you no longer have
  access to that workspace" message instead of the raw API error — it does not sign the user out.

### List, search, sort, and pagination

- `GET /clients` powers the default list and the simple `q` search box (name, company, email, and
  phone — never notes), debounced ~400ms and reflected in the URL (`?q=...`) with `router.replace`
  so typing doesn't spam browser history.
- The "Has email" / "Has phone" filters map to `undefined` / `true` / `false`. As soon as either is
  set to something other than "Any", the frontend switches to `QUERY /clients/search` with a JSON
  body (`search`, `filters`, `sort`, `pagination`) instead of `GET /clients`; clearing both filters
  reverts to the simple `GET` request. The `QUERY` request is sent with the real HTTP `QUERY`
  method (not emulated via `POST`) directly to the Express API, with `Authorization`,
  `X-Workspace-Id`, and `Content-Type` headers, and is read-only.
- Sorting exposes friendly labels ("Newest first", "Name A–Z", etc.) that map to the API's
  allowlisted `sortBy`/`sortOrder` values — arbitrary field names never reach the API.
- Pagination is server-driven from the API's pagination metadata (fixed page size of 20); Previous
  and Next are disabled based on `hasPreviousPage`/`hasNextPage`, and search, filters, sort, and
  page all live in the URL so results are bookmarkable and shareable.
- Search, filters, sort, page, and workspace changes all reset pagination to page 1 and cancel any
  in-flight request for the previous parameters.

### Create, edit, and delete

- `/clients/new` and `/clients/[clientId]/edit` share one `ClientForm` component with Zod
  validation matching the API's constraints (name required, 2–120 characters; email, company,
  phone, and notes optional with the API's exact length limits; empty optional fields are sent as
  `null`, never as empty strings).
- On success, create redirects to `/clients/<id>?status=created` and edit redirects to
  `/clients/<id>?status=updated`; both show a dismissible success notice that is stripped from the
  URL after rendering.
- Deletion (from the client list or the client detail page) requires an accessible native
  `<dialog>` confirmation naming the client — there is no `window.confirm` and no immediate delete
  on click. The dialog traps focus, supports Escape-to-cancel (disabled mid-delete), and disables
  repeated confirm clicks. A successful delete from the detail page redirects to
  `/clients?status=deleted`; a successful delete from the list refetches the current page, or the
  previous page if the deleted row was the last one on a page beyond the first.
- `DELETE /clients/:clientId` returns `204 No Content`; the frontend does not attempt to parse a
  body from that response.

### Errors and limitations

- `VALIDATION_ERROR` responses map to per-field errors on the form; unrecognized fields surface as
  a form-level message. `CLIENT_NOT_FOUND` renders a dedicated not-found state (also used for a
  route id that fails UUID validation before any request is made, so an invalid id never reaches
  the API). Network failures, timeouts, and unexpected server errors render a generic recoverable
  error state with a retry action.
- Authentication failures from any client request (`ACCESS_TOKEN_EXPIRED`, `INVALID_ACCESS_TOKEN`,
  `AUTHENTICATION_REQUIRED`, `INVALID_AUTHORIZATION_HEADER`) end the session through the same
  `SessionProvider` used everywhere else, via a `handleAuthenticationFailure(code)` method on the
  session context — there is no second, duplicate token store.
- The list and detail views use a responsive table (desktop) and stacked cards (mobile), each
  hidden from the accessibility tree at the other breakpoint via `display: none`, so there are
  never duplicate focusable controls for the same client.
- Client data is not cached or persisted in browser storage; it is fetched fresh from the API on
  every view. API authorization remains the sole source of truth for what a user can see — the
  frontend guards are UX, not security.
- Any workspace member can currently create, edit, and delete clients; granular role-based write
  restrictions are not implemented. Projects, billing, client import/export, tags, custom fields,
  activity history, and bulk actions are not implemented.

## Database

Prisma ORM is owned by `apps/api`. Its initial schema contains `User`, `Workspace`, and
`Membership`, with `OWNER`, `ADMIN`, and `MEMBER` membership roles. A user may belong to multiple
workspaces, and each user/workspace pair is unique. `Client` records belong to workspaces and are
deleted with their workspace. Project models will be added in later work.

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
and enforces client-side route protection as described in [Authentication](#authentication). API
authorization remains the actual security boundary. Client endpoints use the selected workspace
header and database-backed membership authorization, described in
[Client management](#client-management). Granular workspace role restrictions, project CRUD, and
billing are not implemented.
