# Poker Pace

Poker Pace is a mobile-first no-limit Texas Hold'em study app for preparing for a friends' tournament. It guides a beginner through short daily lessons, decision quizzes, missed-question training, and a tournament checklist.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- lucide-react
- Vitest + Testing Library
- Biome
- pnpm

## Commands

Install dependencies:

```sh
pnpm install
```

Run the local dev server:

```sh
pnpm dev
```

Run tests:

```sh
pnpm test
```

Run Biome checks:

```sh
pnpm check
```

Build for production:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```

## App Structure

- `src/App.tsx` owns the top-level app state, tab selection, lesson flow, trainer sessions, and progress persistence.
- `src/domain/course.ts` contains the static course units, quizzes, and tournament checklist content.
- `src/domain/progress.ts` contains pure progress helpers such as completion, recommendations, missed quiz IDs, and checklist toggles.
- `src/domain/storage.ts` is the localStorage boundary.
- `src/screens` contains the main tab and lesson screens.
- `src/components` contains reusable UI pieces.

## Product Notes

The app stores progress locally in the browser under `poker-pace:v1:progress`. There is no backend or account system. Course content is intentionally concise and beginner-oriented so a player can study in short sessions before an in-person tournament.

## Agent Guidance

Project-specific agent instructions live in `.agents/AGENTS.md`. Claude-compatible tooling can read the same guidance through `.claude/CLAUDE.md`, which is a symlink to that file.
