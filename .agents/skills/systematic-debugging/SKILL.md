---
name: systematic-debugging
description: Use when encountering any bug, error, build or type failure, or unexpected UI behavior, before proposing a fix.
---

<!-- Generated from .claude/skills/systematic-debugging/ by .claude/scripts/sync-agents.mjs. Edit the source, not this file. -->

# Systematic Debugging

Adapted for this project from [obra/superpowers](https://github.com/obra/superpowers) (MIT License).

Random fixes waste time and create new bugs. **Find the root cause before attempting any fix.** A fix applied to a symptom is a failure, even if the symptom disappears.

Use this especially when a quick fix seems obvious, when a previous fix did not work, or when you do not fully understand the issue. At any point, if you notice a pattern from `.agents/skills/systematic-debugging/references/red-flags.md`, return to Phase 1.

## Phase 1 — Root cause investigation

1. **Read the error completely.** Stack traces, file paths, line numbers, the Next.js dev overlay, the browser console, and `tsc`/ESLint output often contain the answer.
2. **Reproduce it reliably.** Exact steps, route, viewport width, light/dark mode, logged-in or not. If you cannot reproduce it, gather more data — do not guess.
3. **Check recent changes.** `git diff`, `git log`, new dependencies, config changes (`next.config.ts`, `theme.css`, tsconfig).
4. **Locate the failing boundary.** Read `.agents/skills/systematic-debugging/references/frontend-boundaries.md`, find which boundary the data crosses incorrectly, then investigate only that one.
5. **Trace the bad value backward** to where it originates, and fix it there — not where the error surfaces.

## Phase 2 — Pattern analysis

1. Find similar code in this repo that works (another page, the other app, a `@repo/ui` component).
2. If following a reference (Next.js docs in `node_modules/next/dist/docs/`, library docs), read it completely.
3. List every difference between the working and broken versions, however small.

## Phase 3 — Hypothesis and testing

1. State one hypothesis: "I think X is the root cause because Y."
2. Test it with the smallest possible change, one variable at a time.
3. If it does not hold, form a new hypothesis. Do not stack more fixes on top.
4. If you do not understand something, say so.

## Phase 4 — Fix

1. **Have a reproduction before fixing**: a failing `tsc`/ESLint run, a minimal page state, or exact browser steps you can repeat.
2. Make **one** fix at the root cause. No "while I'm here" improvements.
3. Verify: the reproduction no longer fails, `npx tsc --noEmit -p apps/<app>` and lint pass, and nothing else broke (check the other app if `packages/*` changed).
4. If the bad value could reach the same place another way, guard it at the boundary where it enters.

**If a fix does not work:** under 3 attempts, return to Phase 1 with what you learned. **At 3 or more, stop and question the approach** — when each fix reveals a new problem elsewhere, the design is wrong, not the hypothesis. Discuss with the user before trying again.

## When there is truly no root cause in the code

If the issue is environmental, timing-dependent, or external (API down, network), document what you investigated, then add appropriate handling (error state, retry, message to the user). Most "no root cause" conclusions are incomplete investigations, so be sure first.
