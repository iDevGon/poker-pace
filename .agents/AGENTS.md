# Poker Pace Agent Guide

## Project Overview

Poker Pace is a mobile-first no-limit Texas Hold'em study app for preparing for a friends' tournament. It is a single-page React app built with Vite and TypeScript. The core experience is a 28-day course, short quiz sessions, missed-question training, and a tournament checklist.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4 through `@tailwindcss/vite`
- lucide-react for icons
- Vitest + Testing Library
- Biome for linting and formatting
- pnpm as the package manager

## Important Paths

- `src/App.tsx`: top-level app state, tab routing, progress persistence, and lesson/trainer orchestration.
- `src/domain/course.ts`: static course, quiz, and tournament checklist content.
- `src/domain/progress.ts`: pure progress and recommendation helpers.
- `src/domain/storage.ts`: localStorage load/save boundary.
- `src/domain/types.ts`: shared domain types.
- `src/screens/*.tsx`: main app screens.
- `src/components/*.tsx`: reusable UI pieces.
- `src/styles.css`: global styles and design tokens.
- `src/test/setup.ts`: Vitest DOM setup.

## Working Rules

- Keep changes surgical. Do not refactor adjacent code or restyle broad areas unless the task requires it.
- Prefer small pure helpers in `src/domain` for business logic and keep browser APIs at the edge.
- Preserve existing TypeScript strictness and avoid `any`.
- Match the existing component style: typed props, named exports for components, and direct Tailwind utility classes.
- Use lucide-react icons when adding common UI actions.
- Do not introduce routing, global state libraries, backend services, or remote persistence unless explicitly requested.
- Treat `localStorage` schema changes carefully. If progress shape changes, update validation and tests.
- Existing poker content is intentionally beginner-focused and concise. Keep new lesson and quiz copy practical, short, and tournament-oriented.

## UI Guidelines

- Design mobile-first. The app shell is constrained to a phone-width layout; verify small viewport behavior.
- Keep the current dark felt/table visual language and the established CSS variables in `src/styles.css`.
- Buttons and tappable controls should remain large enough for touch use.
- Do not add marketing/landing-page sections. The first screen should stay the usable study experience.
- Avoid decorative UI that does not support learning progress, quiz decisions, or tournament preparation.

## Verification

Use the smallest check that proves the change:

- Domain logic changes: `pnpm test`
- TypeScript or production-surface changes: `pnpm build`
- Formatting/linting-sensitive changes: `pnpm check`
- UI behavior changes: run `pnpm dev` and inspect the relevant screen in a browser when feasible.

Before finishing, state which checks were run and any checks that were skipped.
