# Graph Report - ClientFlow  (2026-07-30)

## Corpus Check
- 23 files · ~8,920 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 181 nodes · 155 edges · 31 communities (18 shown, 13 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `What You Must Do When Invoked` - 11 edges
2. `compilerOptions` - 10 edges
3. `/graphify` - 10 edges
4. `Graphify Workflow` - 9 edges
5. `graphify reference: extra exports and benchmark` - 7 edges
6. `scripts` - 6 edges
7. `scripts` - 6 edges
8. `scripts` - 6 edges
9. `tasks` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Incremental Graph Update` --conceptually_related_to--> `Semantic Extraction Cache`  [INFERRED]
  .agents/skills/graphify/references/update.md → .agents/skills/graphify/SKILL.md
- `Project Graphify Workflow` --references--> `Graph Query`  [EXTRACTED]
  AGENTS.md → .agents/skills/graphify/references/query.md
- `Project Graphify Workflow` --references--> `Incremental Graph Update`  [EXTRACTED]
  AGENTS.md → .agents/skills/graphify/references/update.md
- `Graphify Workflow` --references--> `URL Ingestion`  [EXTRACTED]
  .agents/skills/graphify/SKILL.md → .agents/skills/graphify/references/add-watch.md
- `Graphify Workflow` --references--> `Graph Exports`  [EXTRACTED]
  .agents/skills/graphify/SKILL.md → .agents/skills/graphify/references/exports.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Auto-Suggestion Hooks (Claude Code + Codex)** — _claude_settings_pretooluse_bash_hook, _claude_settings_pretooluse_read_glob_hook, _codex_hooks_pretooluse_bash_hook [INFERRED 0.85]
- **Graphify Extraction Pipeline** — agents_skills_graphify_skill_structural_extraction, agents_skills_graphify_skill_semantic_extraction, agents_skills_graphify_skill_semantic_cache [EXTRACTED 1.00]

## Communities (31 total, 13 thin omitted)

### Community 0 - "Core Graphify Workflow"
Cohesion: 0.13
Nodes (18): Project Graphify Workflow, ClientFlow Project Architecture, Folder Watcher, URL Ingestion, Graph Exports, Graph MCP Server, Edge Confidence Rubric, Extraction Schema (+10 more)

### Community 1 - "Project Query Workflow"
Cohesion: 0.13
Nodes (14): dependsOn, outputs, cache, cache, persistent, dependsOn, $schema, tasks (+6 more)

### Community 2 - "Semantic Extraction"
Cohesion: 0.14
Nodes (14): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+6 more)

### Community 3 - "Updates and Ingestion"
Cohesion: 0.14
Nodes (13): devDependencies, turbo, typescript, name, packageManager, private, scripts, build (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, module, moduleResolution, noEmitOnError, outDir, rootDir, skipLibCheck (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, clean, dev, lint, typecheck (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, clean, lint, typecheck, type (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, clean, dev, lint, typecheck (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (6): Definition of done, Graphify, Project, Rules, Validation, Workflow

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (5): ClientFlow, Installation, Monorepo structure, Prerequisites, Root scripts

### Community 18 - "Community 18"
Cohesion: 0.50
Nodes (3): name, private, version

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

## Knowledge Gaps
- **119 isolated node(s):** `PreToolUse`, `PreToolUse`, `name`, `version`, `private` (+114 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `Semantic Extraction` to `Community 12`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `PreToolUse`, `name` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core Graphify Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `Project Query Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Semantic Extraction` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `Updates and Ingestion` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._