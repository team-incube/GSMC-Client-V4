---
name: review-diff
description: Review the local diff for real defects in a Next.js/React frontend — bugs, rendering-boundary mistakes, security holes, performance traps. Fans out one subagent per lens, then verifies every finding before reporting. Not a style or convention checker; use the reviewer agent for conventions. Only run when the user explicitly asks for it.
allowed-tools: Read, Glob, Grep, Bash(git *:*), Bash(grep *:*), Bash(ls *:*), Bash(find *:*)
---

<!-- Generated from .claude/skills/review-diff/ by .claude/scripts/sync-agents.mjs. Edit the source, not this file. -->

# Review the local diff

The `reviewer` agent checks conventions (FSD, tokens, duplication). This skill looks for **things that break**.

## Step 1 — Gather the diff and rules

```bash
git branch --show-current
git status --porcelain --untracked-files=all
git diff --stat                            # uncommitted
git diff --stat origin/develop...HEAD      # whole branch
```

Read `AGENTS.md` and `.claude/rules/*.md`. A finding that cites a project rule is actionable; "I'd have written it differently" is not.

## Step 2 — Pick the lenses

Each lens is a separate file in `.agents/skills/review-diff/lenses/`:

| Lens | File | Skip when |
|---|---|---|
| correctness | `correctness.md` | never |
| rendering boundary | `rendering-boundary.md` | the diff touches no components or routes |
| security | `security.md` | never |
| performance | `performance.md` | the diff has no rendering or data-fetching changes |

## Step 3 — Review

| Diff size | How |
|---|---|
| A handful of files, one concern | Review directly, **one pass per lens**, reading each lens file before its pass |
| Many files, or several concerns mixed | Fan out: one subagent per lens |

**Fan-out**: spawn all subagents in **one message** with `subagent_type: "general-purpose"`. Give each: the diff range, the full contents of its lens file, the rule files, and this instruction — *read only, change nothing, report `file:line` and what breaks for every finding.*

One context holding every lens at once reviews each shallowly; that is why lenses are separate. If subagents are unavailable, fall back to one pass per lens and say so in the report.

## Step 4 — Verify before reporting

Subagent findings are **claims, not results**. For each one:

1. Open the cited `file:line` and confirm the code says what the finding says.
2. Confirm it is inside this diff, not pre-existing code.
3. Merge duplicates across lenses.
4. Drop anything you cannot confirm, or list it under 미확인 with what would settle it.

Reporting an unverified finding is worse than missing one: after the first phantom, the author stops trusting the review.

## Step 5 — Report

Follow `.agents/skills/review-diff/references/report-format.md`.
