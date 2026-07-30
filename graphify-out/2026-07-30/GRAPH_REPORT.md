# Graph Report - .  (2026-07-30)

## Corpus Check
- Corpus is ~8,536 words - fits in a single context window. You may not need a graph.

## Summary
- 24 nodes · 20 edges · 10 communities (4 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Core Graphify Workflow
- Project Query Workflow
- Semantic Extraction
- Updates and Ingestion
- Claude Search Hook
- Claude Query Hook
- Codex Hook
- Post-Commit Hook
- Cluster Rebuild
- Claude Instructions

## God Nodes (most connected - your core abstractions)
1. `Graphify Workflow` - 9 edges
2. `Incremental Graph Update` - 5 edges
3. `Semantic Extraction` - 3 edges
4. `Graph Query` - 3 edges
5. `Project Graphify Workflow` - 3 edges
6. `Semantic Extraction Cache` - 2 edges
7. `URL Ingestion` - 2 edges
8. `Graph Exports` - 2 edges
9. `Extraction Schema` - 2 edges
10. `Structural AST Extraction` - 1 edges

## Surprising Connections (you probably didn't know these)
- `Incremental Graph Update` --conceptually_related_to--> `Semantic Extraction Cache`  [INFERRED]
  .agents/skills/graphify/references/update.md → .agents/skills/graphify/SKILL.md
- `Project Graphify Workflow` --references--> `Incremental Graph Update`  [EXTRACTED]
  AGENTS.md → .agents/skills/graphify/references/update.md
- `Graphify Workflow` --references--> `URL Ingestion`  [EXTRACTED]
  .agents/skills/graphify/SKILL.md → .agents/skills/graphify/references/add-watch.md
- `Project Graphify Workflow` --references--> `Graph Query`  [EXTRACTED]
  AGENTS.md → .agents/skills/graphify/references/query.md
- `Graphify Workflow` --references--> `Graph Exports`  [EXTRACTED]
  .agents/skills/graphify/SKILL.md → .agents/skills/graphify/references/exports.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Auto-Suggestion Hooks (Claude Code + Codex)** — _claude_settings_pretooluse_bash_hook, _claude_settings_pretooluse_read_glob_hook, _codex_hooks_pretooluse_bash_hook [INFERRED 0.85]
- **Graphify Extraction Pipeline** — agents_skills_graphify_skill_structural_extraction, agents_skills_graphify_skill_semantic_extraction, agents_skills_graphify_skill_semantic_cache [EXTRACTED 1.00]

## Communities (10 total, 6 thin omitted)

### Community 0 - "Core Graphify Workflow"
Cohesion: 0.29
Nodes (7): Graph Exports, Graph MCP Server, Cross-Repository Graph Merge, Media Transcription, Existing Graph Fast Path, Graphify Workflow, Structural AST Extraction

### Community 1 - "Project Query Workflow"
Cohesion: 0.50
Nodes (4): Project Graphify Workflow, ClientFlow Project Architecture, Graph Query, BFS and DFS Graph Traversal

### Community 2 - "Semantic Extraction"
Cohesion: 0.50
Nodes (4): Edge Confidence Rubric, Extraction Schema, Semantic Extraction Cache, Semantic Extraction

### Community 3 - "Updates and Ingestion"
Cohesion: 0.67
Nodes (3): Folder Watcher, URL Ingestion, Incremental Graph Update

## Knowledge Gaps
- **13 isolated node(s):** `PreToolUse Bash Hook (graphify search suggestion)`, `PreToolUse Read|Glob Hook (graphify query suggestion)`, `PreToolUse Bash Hook (graphify.EXE hook-check)`, `Claude Code Instructions (CLAUDE.md)`, `Structural AST Extraction` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Graphify Workflow` connect `Core Graphify Workflow` to `Project Query Workflow`, `Semantic Extraction`, `Updates and Ingestion`?**
  _High betweenness centrality (0.401) - this node is a cross-community bridge._
- **Why does `Incremental Graph Update` connect `Updates and Ingestion` to `Core Graphify Workflow`, `Project Query Workflow`, `Semantic Extraction`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `Semantic Extraction` connect `Semantic Extraction` to `Core Graphify Workflow`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **What connects `PreToolUse Bash Hook (graphify search suggestion)`, `PreToolUse Read|Glob Hook (graphify query suggestion)`, `PreToolUse Bash Hook (graphify.EXE hook-check)` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._