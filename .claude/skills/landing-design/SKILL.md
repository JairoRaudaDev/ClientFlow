---
name: landing-design
description: >
  Design, implement, review, or refine landing pages, pricing pages,
  product marketing pages, launch pages, and public-facing websites.
  Use for visual storytelling, page hierarchy, hero sections,
  conversion flow, marketing composition, imagery, and motion.
  Do not use as the visual lead for dashboards, admin panels,
  settings pages, or application interfaces.
---

# Landing Design

Design public-facing pages that feel like the same product as the
application while allowing more expressive composition and storytelling.

## Authority

Follow this precedence order:

1. `AGENTS.md`
2. `.interface-design/system.md`
3. `.interface-design/marketing.md`, when it exists
4. This skill
5. Generic web-design conventions

Never override a higher-priority source.

## Required context

Before designing or modifying a public-facing page:

1. Read `AGENTS.md`.
2. Read `.interface-design/system.md`.
3. Read `.interface-design/marketing.md` when present.
4. Inspect the existing application components and design tokens.
5. Identify the page audience, primary action, and central value proposition.

If `.interface-design/system.md` does not exist, inspect the current
product implementation and establish a minimal shared system before
introducing marketing-specific styles.

## Scope

Use this skill for:

- landing pages
- homepages
- pricing pages
- product marketing pages
- launch pages
- feature pages
- public signup flows
- campaign pages connected to the product

For dashboards, admin panels, settings, data interfaces, and repeated
product workflows, use `interface-design` as the visual lead.

## Shared identity

Preserve the established:

- brand personality
- color tokens
- typography families
- spacing scale
- shape language
- button and control styles
- iconography
- depth strategy
- motion principles
- accessibility conventions

A landing page may be more expressive, but it must not look like a
different company or product.

## Marketing adaptations

Public pages may use:

- larger display typography
- larger spacing intervals
- asymmetric compositions
- editorial layouts
- stronger imagery
- product demonstrations
- controlled scroll sequences
- one memorable signature element

These are extensions of the shared system, not replacements for it.

## Page strategy

Before implementation, determine:

- The specific person visiting the page.
- What they should understand within five seconds.
- The single primary action they should take.
- The strongest evidence supporting the promise.
- The principal objection the page must resolve.

Build the page around one clear narrative rather than a collection of
independent sections.

## Visual direction

Choose one central visual thesis for the page.

The hero should express the product's most characteristic idea through
one appropriate device, such as:

- a product demonstration
- an interaction
- an image
- a typographic composition
- a visualization
- a transformation
- a domain-specific object or metaphor

Avoid generic SaaS compositions unless the product context genuinely
calls for them.

## Product connection

When displaying application UI:

- Reuse actual product components.
- Use existing tokens and states.
- Keep screenshots aligned with the real application.
- Do not create fake marketing variants of product controls.
- Do not simplify the product until it becomes misleading.
- Prefer real data structures over decorative dashboard mockups.

## New patterns

When the landing page needs a pattern that does not exist in the shared
system:

1. Derive it from existing visual decisions.
2. Classify it as shared or marketing-only.
3. Add marketing-only decisions to `.interface-design/marketing.md`.
4. Propose changes to shared tokens explicitly.
5. Never modify core tokens silently.

## Implementation quality

Ensure:

- responsive behavior from mobile through desktop
- semantic HTML
- visible keyboard focus
- sufficient contrast
- reduced-motion support
- stable layouts during loading
- appropriate image sizing and formats
- no unnecessary animation
- no decorative element without a clear role

## Review

Before finishing, verify:

- The page communicates one recognizable thesis.
- The primary action is unmistakable.
- The visual identity matches the product.
- The landing page does not resemble a generic template.
- The signature element is visible in the implementation.
- New visual decisions were documented.
- Product UI shown on the page matches the actual application.
