# ClientFlow interface design system

Source of truth for shared product UI (`interface-design` scope: dashboards, client screens, settings).
Marketing-only patterns belong in `.interface-design/marketing.md`.

## Direction

Calm, focused workbench for freelancers and small service businesses managing client records.
Legible, dense-but-clean, with a single indigo accent. Not a glass/blue SaaS dashboard and not a
marketing site.

- **Who**: a freelancer or small service business owner who needs to find and update a client
  record between calls.
- **Task**: see the client list, open a record, and edit it quickly.
- **Feel**: quiet, airy, and predictable. Slate neutrals with one indigo accent.

## Palette

Defined as Tailwind theme tokens in `apps/web/src/app/globals.css`.

| Token               | Value    | Use                               |
| ------------------- | -------- | --------------------------------- |
| `--color-background`| `#f8fafc`| page canvas                       |
| `--color-surface`   | `#ffffff`| cards, rows, inputs               |
| `--color-foreground`| `#0f172a`| primary text                      |
| `--color-muted`     | `#64748b`| secondary text                    |
| `--color-border`    | `#e2e8f0`| hairline borders                  |
| `--color-accent`    | `#4f46e5`| primary action, links, active nav |
| `--color-accent-foreground` | `#f8fafc` | text on primary actions    |
| `--color-accent-muted`      | `#eef2ff` | subtle accent fills        |

Semantic status colors are used sparingly as raw Tailwind utilities: `emerald` for success
notices and `red` for destructive actions and errors.

## Type

System UI stack (`ui-sans-serif`/system-ui), no web fonts. Headings use semibold weight with
`letter-spacing: -0.01em`. Sizes: page headings `text-2xl`–`text-3xl`, section headings
`text-lg`, body `text-sm`, secondary labels `text-xs` with uppercase tracking.

## Shape and motion

- Radii: `--radius-md: 0.5rem` (inputs, buttons), `--radius-lg: 0.75rem` (cards).
- Cards: `bg-surface` with a `border-border` hairline and subtle shadow.
- Buttons: `bg-accent` primary with `hover:bg-indigo-700`; bordered secondary with
  `hover:bg-accent-muted`.
- Focus: visible 2px `--color-accent` ring with `focus-visible:ring-2` and outline removed.
- Motion: `transition-colors` on interactive elements; a small spinner for loading states.
  No animations that add scope.

## Patterns

- **Layout**: marketing pages use `Container`; authenticated pages use the `AppShell` with a
  sidebar (desktop) and a scrollable mobile navigation row.
- **Navigation**: active item uses `bg-accent-muted text-accent`; inactive uses muted text with an
  accent-muted hover.
- **Tables**: desktop client list is a table hidden below `md`; mobile uses stacked cards. Both are
  rendered so only one is in the accessibility tree at a time.
- **States**: every data view has a loading state (`role="status"`), a retryable error state
  (`role="alert"`), an empty state, and a no-results state.
- **Forms**: labeled fields with `aria-invalid`, description/error ids linked via
  `aria-describedby`, and safe client-side validation before submission.
- **Destructive actions**: delete always goes through a confirmation dialog and supports Escape and
  focus return.

## Scope

This system currently governs the dashboard, client list/details/forms, and settings. Projects,
invoices, billing, and subscription screens are intentionally out of scope for the MVP.
