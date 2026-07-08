# EdTech Component Library

A purpose-built library of reusable lesson interaction components, extracted from patterns found in existing EdTech products (Brilliant.org as the primary reference). Forked from [shadcn-ui/ui](https://github.com/shadcn-ui/ui) — existing shadcn primitives are used as a base layer and kept in place as build references.

## What's Here

Seven core interaction components, prototyped and running:

- **MultipleChoice** — question with optional image holder and an answer grid
- **LinearGraph** — slider-driven graph tracking a linear relationship live
- **PercentageBar** — draggable bar filled to a target percentage
- **CoordinatePlane** — draggable point on a 2D grid
- **RatioPicker** — color-mixing ratio table with a live mix swatch
- **Fraction** — tap-to-color shape split into equal segments
- **TileCounter** — counter-tile stimulus with a single answer slot

Plus supporting components (`LessonText`, with `LessonIntro`, `LessonExplainer`, and `LessonCompletion` pending) and shared infrastructure (`useFeedback` hook, `variants.ts` cva recipes, `LessonCard`, `LessonButton`, `LessonFooter`).

Three more core components remain to be defined from further screenshot review.

## Development

```bash
cd apps/v4
pnpm dev
```

Runs at `localhost:4000`.

- **Component source:** `apps/v4/components/lesson/`
- **Playgrounds:** `apps/v4/app/playground/[component]` — isolated, independently testable
- **Docs:** `/docs/components/lesson` — usage, install steps, examples, and props per component
- **Landing page:** live previews of all components

## Design System

Light "graded worksheet" aesthetic — paper backgrounds, ink-blue type, a single amber accent for selection states. All tokens live in `apps/v4/app/globals.css` as `--lesson-*` CSS variables; components never hardcode color. Re-theme by overriding the variables on a wrapper element.

## Registry

Every component and shared infra piece is registered and installable individually:

```bash
npx shadcn@latest add multiple-choice
```

Dependencies (button, card, hook, variants) resolve automatically.

## Status

See the latest project update doc for full inventory, open questions, and decisions pending review.
