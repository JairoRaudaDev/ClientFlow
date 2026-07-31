# Graph Report - .  (2026-07-30)

## Corpus Check
- 93 files · ~21,383 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 677 nodes · 959 edges · 46 communities (32 shown, 14 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.83)
- Token cost: 311,498 input · 0 output

## Community Hubs (Navigation)
- API Bootstrap & Prisma Seed
- Auth Form Components
- App Router Pages
- API Build TSConfig
- API Runtime Dependencies
- Web Package & Next Config
- Root Lint/Format Tooling
- Repo Docs & Agent Rules
- API Dev Dependencies
- Graphify Skill Overview
- Database & Env Config
- Route Group Layouts
- Web Lint/PostCSS Config
- Shared Base TSConfig
- Auth Types & Seed Data
- Shared Config Package Exports
- Graphify Reference Index
- API TSConfig
- Turbo API Env Passthrough
- Turbo Build Pipeline
- Shared Node TSConfig
- Turbo Lint Pipeline
- Graphify Export Options
- Turbo Web Env Passthrough
- Graphify Stale-Check Hook
- Graphify Add/Watch Reference
- Graphify Commit Hook Reference
- Graphify Query Reference
- Graphify Update Reference
- Turbo Clean Task
- Turbo Web Build Outputs
- Graphify GitHub Merge Reference
- Graphify Transcription Reference
- Prettier Config
- Turbo Typecheck Task
- Graphify Extraction Spec
- Next.js Env Types
- Claude Bash Hook Suggestion
- Claude Read/Glob Hook Suggestion
- Codex Hook Check
- Graphify Post-Commit Hook
- Graphify Cluster-Only Rebuild
- API Package Manifest
- Prisma Config Definition
- Claude Code Instructions

## God Nodes (most connected - your core abstractions)
1. `scripts` - 19 edges
2. `env (validated environment config)` - 18 edges
3. `AppError` - 16 edges
4. `scripts` - 16 edges
5. `compilerOptions` - 16 edges
6. `PricingPage` - 15 edges
7. `DashboardPage` - 13 edges
8. `cn (classname helper)` - 13 edges
9. `MarketingHomePage` - 12 edges
10. `What You Must Do When Invoked` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Root package.json (clientflow)` --shares_data_with--> `pnpm Workspace Definition`  [INFERRED]
  package.json → pnpm-workspace.yaml
- `Turbo Pipeline Config` --shares_data_with--> `Docker Compose services`  [INFERRED]
  turbo.json → docker-compose.yml
- `ClientFlow Root README` --references--> `@clientflow/config package manifest`  [EXTRACTED]
  README.md → packages/config/package.json
- `getDatabaseUrl` --semantically_similar_to--> `env (validated environment config)`  [INFERRED] [semantically similar]
  apps/api/prisma.config.ts → apps/api/src/config/env.ts
- `membership_role enum` --shares_data_with--> `registerUser`  [INFERRED]
  apps/api/prisma/migrations/20260730233714_init/migration.sql → apps/api/src/modules/auth/auth.service.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Auto-Suggestion Hooks (Claude Code + Codex)** — _claude_settings_pretooluse_bash_hook, _claude_settings_pretooluse_read_glob_hook, _codex_hooks_pretooluse_bash_hook [INFERRED 0.85]
- **User registration flow** — apps_api_src_modules_auth_auth_controller_register, apps_api_src_modules_auth_auth_service_registeruser, apps_api_src_services_password_service_hashpassword, apps_api_src_services_jwt_service_createaccesstoken, apps_api_src_modules_auth_auth_types_mapauthcontext [EXTRACTED 0.90]
- **Authenticated request middleware chain** — apps_api_src_middleware_authenticate_authenticate, apps_api_src_services_jwt_service_verifyaccesstoken, apps_api_src_modules_auth_auth_service_getcurrentuserauthcontext, types_express_request_auth [EXTRACTED 0.90]
- **Centralized error handling pattern** — apps_api_src_errors_app_error_apperror, apps_api_src_middleware_error_handler_errorhandler, apps_api_src_middleware_not_found_notfound, apps_api_src_middleware_validate_request_validaterequestbody [INFERRED 0.85]
- **Next.js nested route-group layout composition** — apps_web_src_app_layout, apps_web_src_app_marketing_layout, apps_web_src_app_auth_layout, apps_web_src_app_workspace_layout [INFERRED 0.85]
- **Workspace pages sharing PageHeader/EmptyState placeholder pattern** — apps_web_src_app_workspace_clients_page, apps_web_src_app_workspace_dashboard_page, apps_web_src_app_workspace_projects_page, apps_web_src_app_workspace_settings_page [INFERRED 0.80]
- **Authentication flow pages** — apps_web_src_app_auth_login_page, apps_web_src_app_auth_register_page, apps_web_src_app_auth_layout [INFERRED 0.80]
- **Auth form submission flow (validate, submit, store token, navigate)** — apps_web_src_components_auth_login_form_handlesubmit, apps_web_src_components_auth_register_form_handlesubmit, apps_web_src_lib_validation_auth_loginschema, apps_web_src_lib_validation_auth_registerschema, apps_web_src_lib_api_auth_login, apps_web_src_lib_api_auth_register, apps_web_src_lib_api_client_apirequest, apps_web_src_lib_api_errors_apirequesterror, apps_web_src_lib_auth_token_storage_saveaccesstoken [INFERRED 0.90]
- **AppShell workspace navigation composition** — apps_web_src_components_layout_appshell_appshell, apps_web_src_components_layout_brand_brand, apps_web_src_components_layout_mobilenavigation_mobilenavigation, apps_web_src_components_layout_sidebarnavigation_sidebarnavigation, apps_web_src_components_layout_navlink_navlink [EXTRACTED 0.90]
- **UI primitives sharing the cn() classname utility for variant styling** — apps_web_src_components_ui_badge_badge, apps_web_src_components_ui_buttonlink_buttonlink, apps_web_src_components_ui_card_card, apps_web_src_components_ui_container_container, apps_web_src_components_auth_form_field_formfield, apps_web_src_components_layout_navlink_navlink, apps_web_src_lib_cn_cn [INFERRED 0.80]
- **Shared code-quality configuration system** — packages_config_package_clientflow_config, packages_config_eslint_base_baseconfig, packages_config_eslint_node_nodeconfig, packages_config_prettier_index_prettierconfig, packages_config_typescript_base_tsbase, packages_config_typescript_node_tsnode, packages_config_readme_configreadme [INFERRED 0.85]
- **Dockerized local development workflow** — dockercompose_dockercompose, readme_readme, apireadme_apireadme, turbo_turboconfig [INFERRED 0.75]
- **Browser register/login authentication flow** — readme_registerloginflow, readme_sessionstoragetoken, apireadme_authendpoints, apireadme_errorcodes [EXTRACTED 1.00]
- **Graphify Extraction Pipeline** — agents_skills_graphify_skill_structural_extraction, agents_skills_graphify_skill_semantic_extraction, agents_skills_graphify_skill_semantic_cache [EXTRACTED 1.00]

## Communities (46 total, 14 thin omitted)

### Community 0 - "API Bootstrap & Prisma Seed"
Cohesion: 0.07
Nodes (56): getDatabaseUrl, adapter, prisma, seed(), Express app instance, prisma client instance, env (validated environment config), AppError (+48 more)

### Community 1 - "Auth Form Components"
Cohesion: 0.06
Nodes (49): AuthFormError, AuthFormErrorProps, FormField, FieldErrors, FormValues, LoginForm.handleSubmit, initialValues, LoginForm (+41 more)

### Community 2 - "App Router Pages"
Cohesion: 0.08
Nodes (35): LoginPage, metadata, RegisterPage, metadata, MarketingHomePage, metadata, productAreas, PricingPage (+27 more)

### Community 3 - "API Build TSConfig"
Cohesion: 0.05
Nodes (39): compilerOptions, noEmit, outDir, rootDir, exclude, extends, include, dist (+31 more)

### Community 4 - "API Runtime Dependencies"
Cohesion: 0.05
Nodes (40): dependencies, cors, dotenv, express, helmet, jose, pg, @prisma/adapter-pg (+32 more)

### Community 5 - "Web Package & Next Config"
Cohesion: 0.05
Nodes (39): apps/web next.config.ts, nextConfig, @clientflow/web package.json, dependencies, next, react, react-dom, zod (+31 more)

### Community 6 - "Root Lint/Format Tooling"
Cohesion: 0.06
Nodes (35): eslint-config-prettier, globals, devDependencies, eslint-config-prettier, globals, prettier, turbo, @types/node (+27 more)

### Community 7 - "Repo Docs & Agent Rules"
Cohesion: 0.10
Nodes (28): ClientFlow API README, Auth endpoints (/auth/register, /auth/login, /auth/me), Authentication error codes, landing-design Skill, Docker Compose services, Root ESLint Config, Flow-Path Indicator (signature element), ClientFlow Interface Design System (+20 more)

### Community 8 - "API Dev Dependencies"
Cohesion: 0.07
Nodes (26): devDependencies, @clientflow/config, prisma, tsx, @types/cors, @types/express, @types/pg, @clientflow/config (+18 more)

### Community 9 - "Graphify Skill Overview"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 10 - "Database & Env Config"
Cohesion: 0.16
Nodes (17): @prisma/client, adapter, checkDatabaseConnection, connectDatabase, disconnectDatabase, accessTokenTtlSchema, corsOriginSchema, databaseUrlSchema (+9 more)

### Community 11 - "Route Group Layouts"
Cohesion: 0.18
Nodes (12): AuthLayout ((auth) route group), RootLayout, metadata, MarketingLayout ((marketing) route group), WorkspaceLayout ((workspace) route group), AppShell, Brand, links (+4 more)

### Community 12 - "Web Lint/PostCSS Config"
Cohesion: 0.11
Nodes (15): apps/web eslint.config.mjs, nextConfig, apps/web postcss.config.mjs, config, @eslint/js, @eslint/js, ignoredDirectories, compilerOptions (+7 more)

### Community 13 - "Shared Base TSConfig"
Cohesion: 0.11
Nodes (17): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noEmitOnError (+9 more)

### Community 14 - "Auth Types & Seed Data"
Cohesion: 0.15
Nodes (15): demo membership seed data, demo user seed data, demo workspace seed data, AuthContext, AuthenticationData, PublicMembership, PublicUser, PublicWorkspace (+7 more)

### Community 15 - "Shared Config Package Exports"
Cohesion: 0.12
Nodes (16): exports, ./eslint/base, ./eslint/node, ./prettier, ./typescript/base.json, ./typescript/node.json, name, private (+8 more)

### Community 16 - "Graphify Reference Index"
Cohesion: 0.14
Nodes (16): Folder Watcher, URL Ingestion, Graph Exports, Graph MCP Server, Edge Confidence Rubric, Extraction Schema, Cross-Repository Graph Merge, Graph Query (+8 more)

### Community 17 - "API TSConfig"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, rootDir, extends, include, src/**/*.ts (+3 more)

### Community 18 - "Turbo API Env Passthrough"
Cohesion: 0.17
Nodes (12): API_HOST, API_PORT, CORS_ORIGIN, DATABASE_URL, JWT_ACCESS_TOKEN_TTL, JWT_AUDIENCE, JWT_ISSUER, JWT_SECRET (+4 more)

### Community 19 - "Turbo Build Pipeline"
Cohesion: 0.22
Nodes (10): ^build, dependsOn, dependsOn, outputs, dependsOn, outputs, dist/**, build (+2 more)

### Community 20 - "Shared Node TSConfig"
Cohesion: 0.22
Nodes (8): compilerOptions, lib, types, extends, $schema, ./base.json, ES2022, node

### Community 21 - "Turbo Lint Pipeline"
Cohesion: 0.22
Nodes (8): ^lint, cache, persistent, dependsOn, $schema, tasks, dev, lint

### Community 22 - "Graphify Export Options"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 23 - "Turbo Web Env Passthrough"
Cohesion: 0.25
Nodes (8): HOST, NEXT_PUBLIC_API_URL, NODE_ENV, WEB_PORT, cache, passThroughEnv, persistent, @clientflow/web#dev

### Community 25 - "Graphify Add/Watch Reference"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 26 - "Graphify Commit Hook Reference"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 27 - "Graphify Query Reference"
Cohesion: 0.50
Nodes (3): For /graphify explain, For /graphify path, graphify reference: query, path, explain

### Community 28 - "Graphify Update Reference"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 29 - "Turbo Clean Task"
Cohesion: 0.50
Nodes (4): ^clean, cache, dependsOn, clean

### Community 30 - "Turbo Web Build Outputs"
Cohesion: 0.50
Nodes (4): !.next/cache/**, dependsOn, outputs, @clientflow/web#build

### Community 34 - "Turbo Typecheck Task"
Cohesion: 0.67
Nodes (3): ^typecheck, typecheck, dependsOn

## Knowledge Gaps
- **320 isolated node(s):** `Usage`, `What graphify is for`, `Step 0 - GitHub repos and multi-path merge (only if a URL or several paths)`, `Step 1 - Ensure graphify is installed`, `Step 2 - Detect files` (+315 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Web Package & Next Config` to `API Dev Dependencies`?**
  _High betweenness centrality (0.286) - this node is a cross-community bridge._
- **Why does `.next/**` connect `App Router Pages` to `Route Group Layouts`, `Web Package & Next Config`, `Turbo Web Build Outputs`?**
  _High betweenness centrality (0.256) - this node is a cross-community bridge._
- **What connects `Usage`, `What graphify is for`, `Step 0 - GitHub repos and multi-path merge (only if a URL or several paths)` to the rest of the system?**
  _320 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Bootstrap & Prisma Seed` be split into smaller, more focused modules?**
  _Cohesion score 0.06630630630630631 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.061952074810052604 - nodes in this community are weakly interconnected._
- **Should `App Router Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.07993966817496229 - nodes in this community are weakly interconnected._
- **Should `API Build TSConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._