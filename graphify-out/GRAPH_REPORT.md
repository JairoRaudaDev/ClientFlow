# Graph Report - .  (2026-07-31)

## Corpus Check
- Corpus is ~33,297 words - fits in a single context window. You may not need a graph.

## Summary
- 950 nodes · 1671 edges · 55 communities (39 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Client Edit Page
- API Bootstrap and Errors
- Database Seed Script
- App Root Layout
- Prisma Database Layer
- Login Page
- Interface Design System
- App Route Layouts
- ESLint Tooling
- Web Dependencies
- Web TypeScript Config
- Client List Toolbar
- Root Scripts
- Shared TypeScript Base
- API Dependencies
- Config Package
- Graphify Tooling
- Next ESLint Config
- Client Detail Page
- Project Documentation
- API Package
- API Dev Dependencies
- API TypeScript Config
- API Build Config
- API Environment Variables
- Turbo Task Pipeline
- Turbo Checks
- Node TS Config
- Web Build Config
- Web Environment Variables
- Package Manifests
- Shared UI Components
- Auth Data Model
- Repo Orchestration
- Turbo Clean Task
- Auth Types
- Prettier Config
- Next Environment Types
- PostCSS Config
- Auth Validation Schemas
- Web Tooling Config
- Graphify Hook
- API Package Manifest
- Auth Form Error
- Auth Layout
- Authentication Data Type
- Post-Commit Graph Hook
- Product Brand
- Page Header Component
- Cluster Rebuild
- Web Package Manifest
- Web Path Alias

## God Nodes (most connected - your core abstractions)
1. `useSession()` - 31 edges
2. `useActiveWorkspace()` - 23 edges
3. `scripts` - 19 edges
4. `scripts` - 16 edges
5. `compilerOptions` - 16 edges
6. `env` - 15 edges
7. `ApiRequestError` - 15 edges
8. `AppError` - 13 edges
9. `isAuthFailureCode()` - 13 edges
10. `Client` - 13 edges

## Surprising Connections (you probably didn't know these)
- `createAccessToken` --references--> `env`  [EXTRACTED]
  C:/Users/jairo/dev/ClientFlow/apps/api/src/services/jwt.service.ts → apps/api/src/config/env.ts
- `authRouter` --calls--> `validateRequestBody()`  [EXTRACTED]
  C:/Users/jairo/dev/ClientFlow/apps/api/src/modules/auth/auth.routes.ts → apps/api/src/middleware/validate-request.ts
- `Root package.json (clientflow)` --shares_data_with--> `pnpm Workspace Definition`  [INFERRED]
  C:/Users/jairo/dev/ClientFlow/package.json → C:/Users/jairo/dev/ClientFlow/pnpm-workspace.yaml
- `Turbo Pipeline Config` --shares_data_with--> `Docker Compose services`  [INFERRED]
  C:/Users/jairo/dev/ClientFlow/turbo.json → C:/Users/jairo/dev/ClientFlow/docker-compose.yml
- `startServer` --calls--> `app`  [EXTRACTED]
  C:/Users/jairo/dev/ClientFlow/apps/api/src/server.ts → apps/api/src/app.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Authenticated request middleware chain** — middleware_authenticate_authenticate, services_jwt_service_verifyaccesstoken, auth_service_getcurrentuserauthcontext [EXTRACTED 0.90]
- **Centralized error handling pattern** — errors_app_error_apperror, middleware_error_handler_errorhandler, middleware_not_found_notfound, apps_api_src_middleware_validate_request_validaterequestbody [INFERRED 0.85]
- **User registration flow** — auth_controller_register, auth_service_registeruser, services_password_service_hashpassword, services_jwt_service_createaccesstoken, auth_types_mapauthcontext [EXTRACTED 0.90]
- **UI primitives sharing the cn() classname utility for variant styling** — ui_buttonlink_buttonlink, ui_card_card, ui_container_container, auth_form_field_formfield, apps_web_src_components_layout_navlink_navlink, lib_cn_cn [INFERRED 0.80]
- **Graphify Extraction Pipeline** — skill_structural_extraction, skill_semantic_extraction, skill_semantic_cache [EXTRACTED 1.00]
- **Design System Data Patterns** — _interface_design_system_data_states, _interface_design_system_forms, _interface_design_system_confirmation_dialog, _interface_design_system_responsive_tables [EXTRACTED 1.00]
- **API Authentication Flow** — api_readme_register, api_readme_login, api_readme_current_user, api_readme_access_token, api_readme_authentication [EXTRACTED 1.00]
- **Prisma Schema Entities** — api_readme_user, api_readme_workspace, api_readme_membership, api_readme_client [EXTRACTED 1.00]
- **Dockerized local development workflow** — dockercompose_dockercompose, turbo_turboconfig [INFERRED 0.75]

## Communities (55 total, 16 thin omitted)

### Community 0 - "Client Edit Page"
Cohesion: 0.05
Nodes (77): EditClientPageProps, metadata, metadata, metadata, ClientCardList(), ClientCardListProps, ClientDeleteDialog(), ClientDeleteDialogProps (+69 more)

### Community 1 - "API Bootstrap and Errors"
Cohesion: 0.05
Nodes (66): AppError, AppErrorDetail, AppErrorOptions, errorHandler(), ErrorResponse, isErrorRecord(), isMalformedJsonError(), isPayloadTooLargeError() (+58 more)

### Community 2 - "Database Seed Script"
Cohesion: 0.05
Nodes (56): adapter, DemoClient, demoClients, prisma, seed(), prisma, authenticate(), countAuthorizationHeaders() (+48 more)

### Community 3 - "App Root Layout"
Cohesion: 0.06
Nodes (51): metadata, Providers(), initialState, SessionContext, SessionProvider(), SessionState, ActiveWorkspaceContext, ActiveWorkspaceProvider() (+43 more)

### Community 4 - "Prisma Database Layer"
Cohesion: 0.05
Nodes (55): @prisma/client, app, adapter, checkDatabaseConnection(), connectDatabase(), disconnectDatabase(), accessTokenTtlSchema, corsOriginSchema (+47 more)

### Community 5 - "Login Page"
Cohesion: 0.06
Nodes (37): LOGIN_NOTICES, LoginPage(), LoginPageProps, metadata, metadata, RegisterPage(), RegisterPageProps, AuthFormError() (+29 more)

### Community 6 - "Interface Design System"
Cohesion: 0.08
Nodes (46): AppShell Layout, Confirmation Dialog, Container Layout, Data View States, ClientFlow Design System, Form Validation Pattern, Indigo Accent, Design Palette (+38 more)

### Community 7 - "App Route Layouts"
Cohesion: 0.07
Nodes (26): NotFound (404 page), features, metadata, FormField(), FormFieldProps, ClientFormProps, ClientFormValues, FIELD_KEYS (+18 more)

### Community 8 - "ESLint Tooling"
Cohesion: 0.05
Nodes (39): eslint-config-prettier, @eslint/js, globals, devDependencies, eslint, eslint-config-prettier, @eslint/js, globals (+31 more)

### Community 9 - "Web Dependencies"
Cohesion: 0.05
Nodes (36): dependencies, next, react, react-dom, zod, devDependencies, @clientflow/config, eslint (+28 more)

### Community 10 - "Web TypeScript Config"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+15 more)

### Community 11 - "Client List Toolbar"
Cohesion: 0.17
Nodes (19): ClientListToolbar(), ClientListToolbarProps, buildListHref(), CLIENT_LIST_PAGE_SIZE, CLIENT_SORT_OPTIONS, ClientListQueryState, ClientSortOption, DEFAULT_CLIENT_LIST_QUERY_STATE (+11 more)

### Community 12 - "Root Scripts"
Cohesion: 0.11
Nodes (19): scripts, build, clean, db:format, db:generate, db:migrate, db:migrate:deploy, db:migrate:status (+11 more)

### Community 13 - "Shared TypeScript Base"
Cohesion: 0.11
Nodes (17): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noEmitOnError (+9 more)

### Community 14 - "API Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, cors, dotenv, express, helmet, jose, pg, @prisma/adapter-pg (+9 more)

### Community 15 - "Config Package"
Cohesion: 0.12
Nodes (16): exports, ./eslint/base, ./eslint/node, ./prettier, ./typescript/base.json, ./typescript/node.json, name, private (+8 more)

### Community 16 - "Graphify Tooling"
Cohesion: 0.14
Nodes (16): Folder Watcher, URL Ingestion, Graph Exports, Graph MCP Server, Edge Confidence Rubric, Extraction Schema, Cross-Repository Graph Merge, Graph Query (+8 more)

### Community 17 - "Next ESLint Config"
Cohesion: 0.12
Nodes (11): nextConfig, ignoredDirectories, compilerOptions, allowJs, checkJs, noEmit, extends, include (+3 more)

### Community 18 - "Client Detail Page"
Cohesion: 0.12
Nodes (9): nextConfig, ClientDetailPageProps, metadata, metadata, metadata, .next/**, !.next/cache/**, outputs (+1 more)

### Community 19 - "Project Documentation"
Cohesion: 0.15
Nodes (13): ESLint Base Config (@clientflow/config/eslint/base), TypeScript Base Config (@clientflow/config/typescript/base.json), Root ESLint Config, Prettier Shared Config (@clientflow/config/prettier), @clientflow/types src/index.ts (placeholder), landing-design Skill, ESLint Node Config (@clientflow/config/eslint/node), TypeScript Node Config (@clientflow/config/typescript/node.json) (+5 more)

### Community 20 - "API Package"
Cohesion: 0.14
Nodes (13): devDependencies, @clientflow/config, @clientflow/config, name, private, scripts, build, clean (+5 more)

### Community 21 - "API Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @clientflow/config, prisma, tsx, @types/cors, @types/express, @types/pg, @clientflow/config (+5 more)

### Community 22 - "API TypeScript Config"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, rootDir, extends, include, src/**/*.ts (+3 more)

### Community 23 - "API Build Config"
Cohesion: 0.17
Nodes (11): compilerOptions, noEmit, outDir, rootDir, exclude, extends, include, dist (+3 more)

### Community 24 - "API Environment Variables"
Cohesion: 0.17
Nodes (12): API_HOST, API_PORT, CORS_ORIGIN, DATABASE_URL, JWT_ACCESS_TOKEN_TTL, JWT_AUDIENCE, JWT_ISSUER, JWT_SECRET (+4 more)

### Community 25 - "Turbo Task Pipeline"
Cohesion: 0.18
Nodes (12): ^build, dependsOn, dependsOn, outputs, dependsOn, outputs, dependsOn, dist/** (+4 more)

### Community 26 - "Turbo Checks"
Cohesion: 0.17
Nodes (11): ^lint, ^typecheck, cache, persistent, dependsOn, $schema, tasks, dev (+3 more)

### Community 27 - "Node TS Config"
Cohesion: 0.22
Nodes (8): compilerOptions, lib, types, extends, $schema, ./base.json, ES2022, node

### Community 28 - "Web Build Config"
Cohesion: 0.25
Nodes (7): compilerOptions, outDir, rootDir, extends, include, @clientflow/config/typescript/base.json, src/**/*.ts

### Community 29 - "Web Environment Variables"
Cohesion: 0.25
Nodes (8): HOST, NEXT_PUBLIC_API_URL, NODE_ENV, WEB_PORT, cache, passThroughEnv, persistent, @clientflow/web#dev

### Community 30 - "Package Manifests"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 31 - "Shared UI Components"
Cohesion: 0.40
Nodes (5): FormField, cn (classname helper), ButtonLink, Card, Container

### Community 32 - "Auth Data Model"
Cohesion: 0.50
Nodes (4): AuthContext, memberships table, users table, workspaces table

### Community 33 - "Repo Orchestration"
Cohesion: 0.67
Nodes (4): Docker Compose services, Root package.json (clientflow), pnpm Workspace Definition, Turbo Pipeline Config

### Community 34 - "Turbo Clean Task"
Cohesion: 0.50
Nodes (4): ^clean, cache, dependsOn, clean

### Community 35 - "Auth Types"
Cohesion: 0.50
Nodes (4): AuthenticationData, PublicMembership, PublicUser, PublicWorkspace

## Knowledge Gaps
- **378 isolated node(s):** `name`, `version`, `private`, `type`, `predev` (+373 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.