@AGENTS.md

# Claude Code

Use `AGENTS.md` as the repository source of truth.

* Check for more specific `AGENTS.md` files before editing a directory.
* Work directly on `main`.
* Complete one clearly scoped task at a time.
* Inspect existing code before changing architecture.
* Avoid unrelated refactors and unnecessary dependencies.
* Review the diff before committing.
* Run relevant validation before claiming completion.

## Graphify

When following the Graphify rules from `AGENTS.md`, use Claude Code slash commands:

* `/graphify query "<question>"`
* `/graphify path "<A>" "<B>"`
* `/graphify explain "<concept>"`
* `/graphify update .`

Do not use the Codex `$graphify` syntax.
