# AGENTS.md

## Project

ClientFlow is a Dockerized monorepo:

* `apps/web`: Next.js frontend
* `apps/api`: Node.js/Express API
* `packages/*`: shared code and configuration
* PostgreSQL with Prisma
* JWT authentication

## Rules

* Follow existing architecture and naming.
* Keep changes small, typed, secure, and production-ready.
* Avoid unnecessary dependencies and abstractions.
* Never commit secrets or `.env` files.
* Validate external input.
* Enforce user and workspace data isolation.
* Update documentation when behavior or setup changes.

More specific `AGENTS.md` files override these rules within their directories.

## Workflow

* Work directly on `main`.
* Complete one clear task at a time.
* Use focused Conventional Commits.
* Do not mix unrelated changes.
* Avoid unrelated refactors.
* Review the diff before committing.
* Keep the application runnable after each commit.

## Validation

Run the checks relevant to the change:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
docker compose config
```

Run the complete validation suite before delivery.

## Definition of done

* The requested behavior works.
* Errors and unauthorized states are handled.
* Important behavior is tested.
* Relevant checks pass.
* Documentation is current.
* The final diff has been reviewed.

## Graphify

This project has a knowledge graph in `graphify-out/`.

For Codex:

* When `graphify-out/graph.json` exists, start codebase questions with `$graphify query "<question>"`.
* Use `$graphify path "<A>" "<B>"` to inspect relationships.
* Use `$graphify explain "<concept>"` for focused concepts.
* Use `graphify-out/wiki/index.md` for broad navigation when available.
* Read `graphify-out/GRAPH_REPORT.md` only for broad architecture reviews or when scoped commands lack enough context.
* After modifying code, run `$graphify update .`.
