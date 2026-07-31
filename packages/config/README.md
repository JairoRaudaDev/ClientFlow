# @clientflow/config

This package provides the shared code-quality configuration used throughout the
ClientFlow monorepo.

## TypeScript

- `@clientflow/config/typescript/base.json` contains strict, framework-neutral
  compiler defaults.
- `@clientflow/config/typescript/node.json` adds Node.js types for server-side
  packages.

Workspace packages add `@clientflow/config` as a workspace development
dependency and extend the appropriate configuration:

```json
{
  "extends": "@clientflow/config/typescript/base.json"
}
```

The API package uses the Node.js configuration. The Next.js web package combines
`eslint-config-next` with the shared base configuration.

## ESLint

- `@clientflow/config/eslint/base` provides JavaScript and type-aware TypeScript
  recommendations, generated-file ignores, production-safety rules, and
  Prettier compatibility.
- `@clientflow/config/eslint/node` extends the base configuration with Node.js
  globals.

The root `eslint.config.mjs` currently loads the base flat configuration for all
workspace lint scripts. Packages can import the Node.js configuration when they
begin to contain Node-specific application code.

## Prettier

`@clientflow/config/prettier` provides the shared formatting defaults. The root
`prettier.config.mjs` loads it so `pnpm format` and `pnpm format:check` apply the
same style across the workspace.

Framework-specific configuration lives in each package: the Next.js web app
extends `eslint-config-next`, and the Express API uses the Node.js configuration.

