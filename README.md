# ClientFlow

ClientFlow is a planned full-stack CRM for freelancers and small agencies. This repository currently provides the production-ready monorepo foundation for the future Next.js frontend, Express API, and shared TypeScript packages.

## Monorepo structure

```text
apps/
  web/       Frontend application placeholder
  api/       Backend application placeholder
packages/
  config/    Future shared tooling configuration
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
- `pnpm clean` removes generated workspace output.

The web and API applications are placeholders. Next.js and Express will be initialized in future commits.

