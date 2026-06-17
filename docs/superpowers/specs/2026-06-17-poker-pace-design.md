# Poker Pace Design

## Summary

Poker Pace is a mobile-first web app for preparing for a friends' no-limit Texas Hold'em tournament in about one month. The user knows only the basic rules today, so the app focuses on guided learning, repeated quiz practice, and a lightweight tournament setup checklist.

The app is not a gambling app, real-money poker app, or tournament operations tool. It is a study and practice app.

## Goals

- Help a beginner build practical Hold'em confidence before an offline friends' tournament.
- Provide a 4-week structured course without forcing exactly one lesson per calendar day.
- Mix short lessons with decision quizzes and card-reading quizzes.
- Track progress locally without login or server infrastructure.
- Include a checklist for agreeing on friends' tournament rules.

## Non-Goals

- No real-money features.
- No multiplayer poker table.
- No account, login, backend, or cross-device sync in the first version.
- No full tournament director features such as live blind timer, player seating, or chip accounting.
- No AI-generated coaching in the first version.

## Product Structure

The app has four main tabs:

- `Today`: The primary entry point. Shows the recommended next lesson, current progress, and a clear start button.
- `Course`: Shows the full 4-week roadmap with all lessons available.
- `Trainer`: Provides review practice, including missed questions and random quiz sets.
- `Tournament`: Provides a checklist for setting up the friends' tournament rules.

`Today` recommends the next study unit, but it does not lock the user to one lesson per day. After completing a lesson, the app offers a `Continue to next lesson` action. In `Course`, all lessons are visible and selectable. The app can mark the recommended order, but it should not block the user from moving faster.

## Course Scope

The course is organized as 28 study units across four weeks:

- Week 1: Rules, hand rankings, betting flow, blinds, showdown, and common table terms.
- Week 2: Position, preflop hand strength, opening ranges, calling, and basic raise sizing.
- Week 3: Flop and turn decisions, board texture, outs, draws, pot odds basics, and hand reading.
- Week 4: Tournament stack awareness, blind pressure, bubble/final-table basics, review, and practice scenarios.

Each unit contains:

- A short goal statement.
- One or more concise lesson blocks.
- Example situations where useful.
- A quiz set.
- A completion result with short feedback.

## Quiz Types

The app supports two quiz types in the first version.

### Decision Quiz

The quiz presents a poker situation and asks the user to choose an action such as `Fold`, `Call`, or `Raise`.

Typical fields:

- Position
- Stack size
- Blind level
- Hole cards
- Previous action
- Available choices
- Correct or recommended answer
- Explanation

### Card-Reading Quiz

The quiz presents hole cards and board cards, then asks about hand strength, current made hand, outs, or a simplified equity judgment.

Typical fields:

- Hole cards
- Board cards
- Question prompt
- Choices
- Correct answer
- Explanation

## Progress Model

Progress is based on completed study units, not dates. A user can finish one unit per day, skip days, or complete several units in one day.

The app stores progress in `localStorage`:

- Completed unit IDs
- Current or last-opened unit ID
- Quiz answer history
- Missed quiz IDs
- Tournament checklist state

The first version does not need a migration system beyond using a versioned localStorage key.

## Screens

### Today

Shows:

- App name and current course progress.
- Recommended next unit.
- Estimated time.
- Start or continue action.
- After completion, a clear action to continue to the next unit.

### Course

Shows:

- Four week sections.
- Unit rows with title, topic, and completion state.
- A visual distinction for completed, in-progress, recommended next, and untouched units.
- No locked lessons.

### Lesson And Quiz Flow

Shows:

- Lesson content first.
- Quiz cards after the lesson.
- One question per screen or compact step.
- Immediate explanation after answering.
- Result summary after all questions.

### Trainer

Shows:

- `Review missed questions`.
- `Random 10 questions`.
- Empty state when there are no missed questions.

### Tournament

Shows a checklist for decisions friends should make before tournament day:

- Participant count
- Starting chips
- Blind increase interval
- Blind structure
- Rebuy or no rebuy
- Add-on or no add-on
- Chip colors and values
- Late registration rule
- Tie-break or prize split rule

Checklist state persists locally.

## Visual Direction

The UI should feel like a focused training app, not a casino. It should be mobile-first, dense enough for repeated use, and readable in short sessions.

Design guidance:

- Bottom tab navigation for the four main areas.
- Stable card and button dimensions to avoid layout shifts.
- Clear poker-card visuals for quiz contexts.
- Restrained color palette with enough contrast between progress, action, and review states.
- Desktop view should present the app in a centered mobile-width frame rather than expanding into a sparse dashboard.

## Technical Approach

Recommended first implementation:

- Vite + React + TypeScript.
- Static course and quiz data in typed source files.
- Local state with React hooks and localStorage persistence.
- No backend.
- No authentication.
- No external poker engine for the first version because the app uses curated beginner training scenarios instead of full game simulation.

Data should be structured so future lessons and quizzes can be added without changing screen logic.

## Verification Criteria

The first version is complete when:

- The first app load shows a recommended study unit.
- A user can read a lesson and complete its quiz.
- Quiz answers show explanations.
- Completing a unit updates `Today` and `Course`.
- A user can complete multiple units in one day.
- Missed questions appear in `Trainer`.
- Tournament checklist selections persist after refresh.
- The app remains usable on a mobile viewport without overlapping controls or clipped button text.

## Open Decisions

No blocking decisions remain before implementation planning. The exact lesson text and quiz content can be drafted during implementation as static seed content.
