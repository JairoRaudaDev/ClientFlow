# ClientFlow

ClientFlow is a planned full-stack CRM for freelancers and small agencies. This repository currently provides the production-ready monorepo foundation for the future Next.js frontend, Express API, and shared TypeScript packages.

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

- Node.js
- pnpm 10.33.2

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

The web and API applications are placeholders. Next.js and Express will be initialized in future commits.
