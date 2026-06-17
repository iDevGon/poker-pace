# Poker Pace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable Poker Pace mobile-first Hold'em study app.

**Architecture:** Use a client-only React app with static course/quiz data, pure domain helpers, localStorage-backed progress, and four main tab screens. Keep the domain logic independent from React so progress and quiz behavior can be tested without browser rendering.

**Tech Stack:** pnpm, Vite, React, TypeScript, Tailwind CSS, Biome, Vitest, Testing Library.

---

## File Structure

- `package.json`: npm scripts and dependencies.
- `index.html`: Vite HTML entry.
- `vite.config.ts`: Vite, Tailwind, and Vitest config.
- `biome.json`: Lint and format config.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript config.
- `src/main.tsx`: React root bootstrap.
- `src/App.tsx`: Top-level app state and tab routing.
- `src/styles.css`: Tailwind import plus small global base styles.
- `src/domain/types.ts`: Shared course, quiz, progress, and checklist types.
- `src/domain/course.ts`: Static 28-unit course outline and seed quiz data.
- `src/domain/progress.ts`: Pure helpers for next unit, completion, missed questions, and checklist updates.
- `src/domain/storage.ts`: Versioned localStorage load/save wrapper.
- `src/domain/progress.test.ts`: Unit tests for pure progress behavior.
- `src/domain/storage.test.ts`: Unit tests for localStorage behavior.
- `src/components/Card.tsx`: Poker card visual component.
- `src/components/BottomTabs.tsx`: Mobile bottom navigation.
- `src/components/ProgressRing.tsx`: Compact progress display.
- `src/screens/TodayScreen.tsx`: Recommended next unit and lesson entry.
- `src/screens/CourseScreen.tsx`: Four-week roadmap.
- `src/screens/LessonScreen.tsx`: Lesson and quiz flow.
- `src/screens/TrainerScreen.tsx`: Missed/random quiz practice.
- `src/screens/TournamentScreen.tsx`: Tournament checklist.
- `src/App.test.tsx`: Interaction smoke tests for the main flow.

## Task 1: Scaffold The App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `biome.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Add package scripts and dependencies**

Create `package.json`:

```json
{
  "name": "poker-pace",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "lucide-react": "latest",
    "tailwindcss": "latest",
    "@tailwindcss/vite": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@biomejs/biome": "latest",
    "jsdom": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: Add Vite and TypeScript config**

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

Create `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json` using the standard Vite React TypeScript split config with strict mode enabled.

Create `biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always"
    }
  }
}
```

- [ ] **Step 3: Add a minimal React shell**

Create `index.html`, `src/main.tsx`, `src/App.tsx`, and `src/styles.css` with a visible Poker Pace shell, four bottom tabs, and mobile-width desktop framing. `src/styles.css` must start with:

```css
@import "tailwindcss";
```

- [ ] **Step 4: Install and verify**

Run:

```bash
pnpm install
pnpm check
pnpm build
```

Expected: dependencies install, Biome passes, and build exits successfully.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml index.html vite.config.ts tsconfig*.json biome.json src
git commit -m "chore: scaffold React app"
```

## Task 2: Add Domain Types, Course Data, And Progress Helpers

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/course.ts`
- Create: `src/domain/progress.ts`
- Create: `src/domain/progress.test.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Write progress tests first**

Create `src/domain/progress.test.ts` with tests for:

```ts
import { describe, expect, it } from 'vitest';
import { courseUnits } from './course';
import {
  completeUnit,
  getCompletionPercent,
  getMissedQuizIds,
  getNextRecommendedUnit,
  initialProgress,
  recordQuizAnswer,
} from './progress';

describe('progress helpers', () => {
  it('recommends the first unfinished unit', () => {
    const first = getNextRecommendedUnit(courseUnits, initialProgress);
    expect(first?.id).toBe('w1d1');
  });

  it('allows multiple units to be completed without date locks', () => {
    const afterFirst = completeUnit(initialProgress, 'w1d1');
    const afterSecond = completeUnit(afterFirst, 'w1d2');
    expect(afterSecond.completedUnitIds).toEqual(['w1d1', 'w1d2']);
    expect(getNextRecommendedUnit(courseUnits, afterSecond)?.id).toBe('w1d3');
  });

  it('tracks missed quiz ids from answer history', () => {
    const progress = recordQuizAnswer(initialProgress, {
      quizId: 'q-preflop-position-1',
      selectedChoiceId: 'call',
      correct: false,
    });
    expect(getMissedQuizIds(progress)).toEqual(['q-preflop-position-1']);
  });

  it('calculates completion percent', () => {
    const progress = completeUnit(initialProgress, 'w1d1');
    expect(getCompletionPercent(courseUnits, progress)).toBe(4);
  });
});
```

- [ ] **Step 2: Run failing tests**

Run:

```bash
pnpm test src/domain/progress.test.ts
```

Expected: FAIL because domain files do not exist yet.

- [ ] **Step 3: Implement types and helpers**

Implement `src/domain/types.ts` with `CourseUnit`, `Quiz`, `ProgressState`, `QuizAnswerRecord`, and `TournamentChecklistItem`. Implement `src/domain/course.ts` with 28 course units and at least 12 seed quizzes. Implement `src/domain/progress.ts` with the functions imported by the tests.

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/domain/progress.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain src/test
git commit -m "feat: add course progress domain"
```

## Task 3: Add Local Storage Persistence

**Files:**
- Create: `src/domain/storage.ts`
- Create: `src/domain/storage.test.ts`

- [ ] **Step 1: Write storage tests**

Create tests that verify:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { initialProgress } from './progress';
import { loadProgress, saveProgress, STORAGE_KEY } from './storage';

describe('storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns initial progress when storage is empty', () => {
    expect(loadProgress()).toEqual(initialProgress);
  });

  it('saves and loads progress', () => {
    saveProgress({ ...initialProgress, completedUnitIds: ['w1d1'] });
    expect(loadProgress().completedUnitIds).toEqual(['w1d1']);
  });

  it('ignores malformed storage', () => {
    localStorage.setItem(STORAGE_KEY, '{bad json');
    expect(loadProgress()).toEqual(initialProgress);
  });
});
```

- [ ] **Step 2: Run failing tests**

Run:

```bash
pnpm test src/domain/storage.test.ts
```

Expected: FAIL because storage functions do not exist yet.

- [ ] **Step 3: Implement storage wrapper**

Create `loadProgress`, `saveProgress`, and `STORAGE_KEY = 'poker-pace:v1:progress'`. Parse unknown data defensively and fall back to `initialProgress`.

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/domain/storage.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/storage.ts src/domain/storage.test.ts
git commit -m "feat: persist progress locally"
```

## Task 4: Build The Main Learning Flow

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/BottomTabs.tsx`
- Create: `src/components/Card.tsx`
- Create: `src/components/ProgressRing.tsx`
- Create: `src/screens/TodayScreen.tsx`
- Create: `src/screens/CourseScreen.tsx`
- Create: `src/screens/LessonScreen.tsx`
- Modify: `src/styles.css`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write app flow tests**

Create tests that verify:

```ts
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('Poker Pace app', () => {
  beforeEach(() => localStorage.clear());

  it('shows the recommended first lesson', () => {
    render(<App />);
    expect(screen.getByText(/Week 1 Day 1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start lesson/i })).toBeInTheDocument();
  });

  it('lets the user answer a quiz and complete a unit', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /start lesson/i }));
    await user.click(screen.getByRole('button', { name: /begin quiz/i }));
    await user.click(screen.getAllByRole('button', { name: /fold|call|raise|top pair|flush draw/i })[0]);
    expect(screen.getByText(/explanation/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run failing app tests**

Run:

```bash
pnpm test src/App.test.tsx
```

Expected: FAIL because screens are not implemented.

- [ ] **Step 3: Implement screens and navigation**

Implement the four-tab shell, Today recommendation, Course list, and Lesson quiz flow using Tailwind utility classes. Persist progress with `saveProgress` after completion and answer records.

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/App.test.tsx src/domain/progress.test.ts src/domain/storage.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "feat: build learning flow"
```

## Task 5: Build Trainer And Tournament Checklist

**Files:**
- Create: `src/screens/TrainerScreen.tsx`
- Create: `src/screens/TournamentScreen.tsx`
- Modify: `src/App.tsx`
- Modify: `src/domain/course.ts`
- Modify: `src/domain/progress.ts`
- Modify: `src/styles.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add tests for trainer and checklist persistence**

Extend `src/App.test.tsx` with tests that:

```ts
it('persists tournament checklist selections after reload', async () => {
  const user = userEvent.setup();
  const { unmount } = render(<App />);
  await user.click(screen.getByRole('button', { name: /tournament/i }));
  await user.click(screen.getByRole('checkbox', { name: /starting chips/i }));
  unmount();
  render(<App />);
  await user.click(screen.getByRole('button', { name: /tournament/i }));
  expect(screen.getByRole('checkbox', { name: /starting chips/i })).toBeChecked();
});
```

- [ ] **Step 2: Run failing tests**

Run:

```bash
pnpm test src/App.test.tsx
```

Expected: FAIL until Trainer and Tournament behavior is wired.

- [ ] **Step 3: Implement Trainer and Tournament screens**

Implement missed-question review, random quiz entry, empty missed-question state, and checklist toggles saved to progress state.

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test
pnpm check
pnpm build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "feat: add trainer and tournament checklist"
```

## Task 6: Final Responsive Polish And Verification

**Files:**
- Modify: `src/styles.css`
- Modify: `README.md`

- [ ] **Step 1: Add README**

Create `README.md` with project purpose and commands:

```md
# Poker Pace

Mobile-first Hold'em study app for preparing for a friends' no-limit Texas Hold'em tournament.

## Commands

- `pnpm dev`
- `pnpm test`
- `pnpm build`
```

- [ ] **Step 2: Run full verification**

Run:

```bash
pnpm test
pnpm check
pnpm build
pnpm dev
```

Expected: tests, Biome checks, and build pass; dev server starts.

- [ ] **Step 3: Browser verification**

Open the dev server and verify:

- Mobile viewport shows Today without overlap.
- Completing a unit updates Today and Course.
- Multiple units can be completed in one session.
- Missed questions appear in Trainer.
- Tournament checklist persists after refresh.

- [ ] **Step 4: Commit and push**

```bash
git add README.md src/styles.css
git commit -m "docs: add project usage"
git push
```

## Self-Review

- Spec coverage: The plan covers mobile-first app shell, 4-week course, mixed quizzes, free progression, local progress, missed-question trainer, and tournament checklist.
- Placeholder scan: No `TBD`, `TODO`, or unresolved implementation placeholders are used as task instructions.
- Type consistency: The plan consistently uses `CourseUnit`, `Quiz`, `ProgressState`, `completedUnitIds`, `quizId`, and `tournament checklist` state.
