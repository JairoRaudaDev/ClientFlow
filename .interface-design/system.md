# ClientFlow interface design system

Source of truth for shared product UI (`interface-design` scope: dashboards, client/project screens, settings, admin). Marketing-only patterns belong in `.interface-design/marketing.md`.

## Direction

Calm, paper-warm workbench for freelancers/agencies managing clients, projects, invoices, and deliverables. Feels like a well-kept paper ledger, not a glass/blue SaaS dashboard.

- **Who**: an agency owner or freelancer triaging client status between calls — needs fast scanning, not browsing.
- **Task**: see where every client/project stands in the flow (lead → active → review → paid) and act on what's overdue.
- **Feel**: warm, quiet, dense-but-legible. Paper and ink, not screens and glass.

## Signature element

**Flow-path indicator** — every client/project row carries a small connected dot-path (lead·active·review·paid) instead of a colored status badge alone. This is the product's namesake concept made visible. Use it anywhere a record has a lifecycle stage; don't substitute a generic pill badge for it.

- Dots: 7px circles, 16px connector line between.
- Completed/current stage stroke: ink-blue (`--accent`). Upcoming stages: `--border-strong`.
- The terminal semantic state (paid = success, overdue = danger) recolors only the last dot + the trailing label, never the whole path.

## Palette

One hue family (paper/ink) plus two reserved semantic colors. Not general-purpose brand colors — grounded in the physical world of paper ledgers, ink signatures, and rubber stamps.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--surface-0` (page) | `#F5F1E8` | `#1C1B17` | canvas |
| `--surface-1` (card/row) | `#FAF7EF` | `#252420` | rows, cards |
| `--surface-2` (popover/dropdown) | `#FFFFFF` | `#2E2C27` | one level above card |
| `--border` | `rgba(44,42,36,0.10)` | `rgba(255,255,255,0.08)` | hairline |
| `--border-strong` | `rgba(44,42,36,0.18)` | `rgba(255,255,255,0.14)` | emphasis, upcoming flow dots |
| `--text-primary` | `#2C2C2A` | `#EDEAE1` | body/headings |
| `--text-secondary` | `#7A7870` | `#A8A498` | supporting |
| `--text-muted` | `#A6A398` | `#78766C` | metadata, placeholders |
| `--accent` (ink-blue) | `#1D3557` | `#6D93C4` | the ONE accent — actions, links, current/complete flow stage |
| `--success` | `#2A9D5C` | `#5FBE87` | paid only |
| `--warning` | `#D98C2B` | `#E8A94F` | review/follow-up only |
| `--danger` | `#C0392B` | `#E0685A` | overdue only |

Rules:
- Single accent (ink-blue). Never a second brand/decorative color.
- Success/warning/danger are semantic-only — never used decoratively, never for arbitrary categorization.
- No gradients. Flat paper surfaces throughout.

## Typography

- Base 14px, scale ratio 1.25: `caption 11 · body 14 · h4 16 · h3 18 · h2 22 · h1 28 · display 40`.
- Sans (`Inter`-class system sans or project's existing sans) for UI chrome and body.
- Optional serif (`Georgia`/existing project serif) reserved for large display headings only (e.g. empty-state headlines, page titles) — an editorial touch against the paper surface, not used in controls or data.
- Hierarchy built from size + weight + color together, not size alone: `value 600/primary`, `label 500/secondary`, `meta 400/muted`.
- Tabular numbers on all invoice/currency/date figures.

## Spacing & density

- Base unit: 4px. Multiples only.
- Density: tight workbench, not airy brochure — row padding 14px vertical / 16px horizontal, card padding 16–20px.
- Client/project lists are dense bordered rows (hairline dividers), not card grids — this is repetitive triage work, not browsing.

## Depth strategy

Borders + flat paper surface shifts. No shadows except a minimal popover shadow.

- Elevation order: `surface-0` (page) → `surface-1` (row/card) → `surface-2` (dropdown/popover, one step lighter + `--shadow-popover`).
- Sidebar shares `surface-0`, separated by a `--border` hairline only — never a different background.
- Inputs are slightly darker/inset relative to surrounding surface, not lighter.

## Border radius

- Inputs/buttons: 6px.
- Cards/rows: 8px.
- Modals/dialogs: 12px.
- Never mix sharp and soft randomly; concentric radius on nested elements (outer = inner + padding).

## Component patterns

- **Flow-path indicator** (see Signature element above) — reuse everywhere a record has a lifecycle stage.
- **Status label** — 12px/500, paired with the flow-path's terminal color (success/warning/danger), never a standalone colored pill elsewhere.
- **Metric card** — `surface-1` bg, no border, 8px radius, 16px padding, 13px muted label above a 24px/500 tabular number.
- **Primary button** — ink-blue fill, 6px radius, 36px height; only one primary action per view. Everything else is secondary/ghost (outline, transparent bg).

## Motion

Standard product motion budget: <300ms, custom ease-out (`cubic-bezier(0.23,1,0.32,1)`) for entrances/popovers, ease-in-out for on-screen movement. No animation on high-frequency actions (row selection, keyboard nav). Respect `prefers-reduced-motion`.
