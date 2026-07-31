# Graph Report - ClientFlow  (2026-07-30)

## Corpus Check
- 90 files · ~18,997 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 578 nodes · 686 edges · 54 communities (36 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d20b48a6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Graphify Workflow|Core Graphify Workflow]]
- [[_COMMUNITY_Project Query Workflow|Project Query Workflow]]
- [[_COMMUNITY_Semantic Extraction|Semantic Extraction]]
- [[_COMMUNITY_Updates and Ingestion|Updates and Ingestion]]
- [[_COMMUNITY_Claude Search Hook|Claude Search Hook]]
- [[_COMMUNITY_Claude Query Hook|Claude Query Hook]]
- [[_COMMUNITY_Codex Hook|Codex Hook]]
- [[_COMMUNITY_Post-Commit Hook|Post-Commit Hook]]
- [[_COMMUNITY_Cluster Rebuild|Cluster Rebuild]]
- [[_COMMUNITY_Claude Instructions|Claude Instructions]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]

## God Nodes (most connected - your core abstractions)
1. `scripts` - 19 edges
2. `scripts` - 16 edges
3. `compilerOptions` - 16 edges
4. `Landing Design` - 12 edges
5. `cn()` - 11 edges
6. `compilerOptions` - 11 edges
7. `tasks` - 11 edges
8. `What You Must Do When Invoked` - 11 edges
9. `compilerOptions` - 10 edges
10. `/graphify` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Incremental Graph Update` --conceptually_related_to--> `Semantic Extraction Cache`  [INFERRED]
  .agents/skills/graphify/references/update.md → .agents/skills/graphify/SKILL.md
- `Project Graphify Workflow` --references--> `Graph Query`  [EXTRACTED]
  AGENTS.md → .agents/skills/graphify/references/query.md
- `Project Graphify Workflow` --references--> `Incremental Graph Update`  [EXTRACTED]
  AGENTS.md → .agents/skills/graphify/references/update.md
- `handleServerError()` --calls--> `disconnectDatabase()`  [EXTRACTED]
  apps/api/src/server.ts → apps/api/src/config/database.ts
- `Request` --references--> `AuthContext`  [EXTRACTED]
  apps/api/src/types/express.d.ts → apps/api/src/modules/auth/auth.types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Auto-Suggestion Hooks (Claude Code + Codex)** — _claude_settings_pretooluse_bash_hook, _claude_settings_pretooluse_read_glob_hook, _codex_hooks_pretooluse_bash_hook [INFERRED 0.85]
- **Graphify Extraction Pipeline** — agents_skills_graphify_skill_structural_extraction, agents_skills_graphify_skill_semantic_extraction, agents_skills_graphify_skill_semantic_cache [EXTRACTED 1.00]

## Communities (54 total, 18 thin omitted)

### Community 0 - "Core Graphify Workflow"
Cohesion: 0.13
Nodes (18): Project Graphify Workflow, ClientFlow Project Architecture, Folder Watcher, URL Ingestion, Graph Exports, Graph MCP Server, Edge Confidence Rubric, Extraction Schema (+10 more)

### Community 1 - "Project Query Workflow"
Cohesion: 0.06
Nodes (31): dependsOn, outputs, cache, dependsOn, dependsOn, outputs, cache, passThroughEnv (+23 more)

### Community 2 - "Semantic Extraction"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 3 - "Updates and Ingestion"
Cohesion: 0.06
Nodes (31): devDependencies, eslint, eslint-config-prettier, @eslint/js, globals, prettier, turbo, @types/node (+23 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, module, moduleResolution, noEmitOnError, outDir, rootDir, skipLibCheck (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.09
Nodes (21): dependencies, cors, dotenv, express, helmet, jose, pg, @prisma/adapter-pg (+13 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (21): AppShell(), Brand(), links, MobileNavigation(), NavLink(), links, SidebarNavigation(), cn() (+13 more)

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (12): devDependencies, @clientflow/config, name, private, scripts, build, clean, dev (+4 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (23): dependencies, next, react, react-dom, devDependencies, @clientflow/config, eslint, eslint-config-next (+15 more)

### Community 15 - "Community 15"
Cohesion: 0.20
Nodes (8): Definition of done, Design, Graphify, Interface design, Project, Rules, Validation, Workflow

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (10): API, Authentication, ClientFlow, Database, Docker development environment, Installation, Monorepo structure, Prerequisites (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (16): exports, ./eslint/base, ./eslint/node, ./prettier, ./typescript/base.json, ./typescript/node.json, name, private (+8 more)

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 20 - "Community 20"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 21 - "Community 21"
Cohesion: 0.50
Nodes (3): For /graphify explain, For /graphify path, graphify reference: query, path, explain

### Community 22 - "Community 22"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (3): hooks, PreToolUse, Stop

### Community 28 - "Community 28"
Cohesion: 0.40
Nodes (4): @clientflow/config, ESLint, Prettier, TypeScript

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (17): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noEmitOnError (+9 more)

### Community 32 - "Community 32"
Cohesion: 0.15
Nodes (12): Authority, Implementation quality, Landing Design, Marketing adaptations, New patterns, Page strategy, Product connection, Required context (+4 more)

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (6): compilerOptions, allowJs, checkJs, noEmit, extends, include

### Community 34 - "Community 34"
Cohesion: 0.33
Nodes (5): compilerOptions, lib, types, extends, $schema

### Community 35 - "Community 35"
Cohesion: 0.25
Nodes (7): compilerOptions, declaration, declarationMap, noEmit, rootDir, extends, include

### Community 36 - "Community 36"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+7 more)

### Community 39 - "Community 39"
Cohesion: 0.17
Nodes (11): Authentication, Authentication errors, ClientFlow API, Commands, Configuration, Current user, Health endpoint, Login (+3 more)

### Community 40 - "Community 40"
Cohesion: 0.15
Nodes (10): metadata, metadata, metrics, metadata, metadata, sections, EmptyState(), EmptyStateProps (+2 more)

### Community 42 - "Community 42"
Cohesion: 0.25
Nodes (7): compilerOptions, noEmit, outDir, rootDir, exclude, extends, include

### Community 43 - "Community 43"
Cohesion: 0.18
Nodes (10): Border radius, ClientFlow interface design system, Component patterns, Depth strategy, Direction, Motion, Palette, Signature element (+2 more)

### Community 45 - "Community 45"
Cohesion: 0.09
Nodes (30): authRouter, adapter, checkDatabaseConnection(), connectDatabase(), disconnectDatabase(), accessTokenTtlSchema, corsOriginSchema, databaseUrlSchema (+22 more)

### Community 46 - "Community 46"
Cohesion: 0.11
Nodes (19): scripts, build, clean, db:format, db:generate, db:migrate, db:migrate:deploy, db:migrate:status (+11 more)

### Community 49 - "Community 49"
Cohesion: 0.07
Nodes (41): getMe(), login(), register(), SuccessResponse, emailSchema, loginBodySchema, LoginInput, nameSchema (+33 more)

## Knowledge Gaps
- **338 isolated node(s):** `PreToolUse`, `Stop`, `allow`, `PreToolUse`, `name` (+333 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `tasks` connect `Project Query Workflow` to `Updates and Ingestion`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `Stop hook: block ending the turn if source files changed since the last graphify`, `PreToolUse`, `Stop` to the rest of the system?**
  _341 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core Graphify Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `Project Query Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `Semantic Extraction` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Updates and Ingestion` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Community 11` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._