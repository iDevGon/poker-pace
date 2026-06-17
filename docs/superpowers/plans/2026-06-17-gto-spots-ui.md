# GTO Spots UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add more common GTO situations and improve the GTO selector and mobile matrix usability.

**Architecture:** Keep the existing single-screen React structure. Add a `category` field to GTO spots, derive category tabs in `GTOScreen`, and keep the 13 by 13 matrix with fixed-size cells inside an overflow container.

**Tech Stack:** React, TypeScript, Tailwind CSS utilities, Vitest, Testing Library.

---

### Task 1: Test Expanded GTO Data

**Files:**
- Modify: `src/domain/types.ts`
- Modify: `src/domain/gto.test.ts`
- Modify: `src/domain/gto.ts`

- [ ] Add a failing test that expects at least eight spots, three categories, and complete 169-hand matrices for every spot.
- [ ] Run `pnpm test src/domain/gto.test.ts` and confirm it fails because the new spots and category field are missing.
- [ ] Add `category` to `GtoSpot` and populate the existing and new spots.
- [ ] Run `pnpm test src/domain/gto.test.ts` and confirm it passes.

### Task 2: Test Grouped Selector UI

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/screens/GTOScreen.tsx`

- [ ] Add a failing UI test that opens GTO, verifies category tabs, switches to `Defend`, and selects a defend spot.
- [ ] Run `pnpm test src/App.test.tsx` and confirm it fails because tabs are not rendered.
- [ ] Implement category tabs and filtered spot rendering in `GTOScreen`.
- [ ] Run `pnpm test src/App.test.tsx` and confirm it passes.

### Task 3: Improve Matrix Touch Size

**Files:**
- Modify: `src/screens/GTOScreen.tsx`

- [ ] Wrap the fieldset in an overflow container.
- [ ] Change the grid columns to fixed cell sizes such as `repeat(13,2.75rem)`.
- [ ] Change each hand button from viewport-dependent `aspect-square` sizing to fixed `size-11`.
- [ ] Run `pnpm test src/App.test.tsx src/domain/gto.test.ts`.
- [ ] Run `pnpm build`.
