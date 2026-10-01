---
name: planning
argument-hint: [feature or idea]
description: Interview the user one question at a time to uncover hidden requirements, constraints, and tradeoffs, then write an implementation spec to docs/specs/. Use when requirements are vague or a feature involves several design decisions. Only run when the user explicitly asks for it.
allowed-tools: Read, Grep, Glob, Write
---

<!-- Generated from .claude/skills/planning/ by .claude/scripts/sync-agents.mjs. Edit the source, not this file. -->

# Planning

Interview the user about every aspect of the plan until you reach a shared understanding, then write a spec. **Do not start implementing.** The spec is the deliverable.

## 1. Read before asking

Never ask a question the codebase can answer. Check:

- `AGENTS.md` and `.claude/rules/` for conventions that constrain the design
- Where the feature belongs in FSD and which app(s) need it
- Whether `@repo/ui` or `@repo/lib` already provides parts of it
- Similar existing pages or components to stay consistent with

## 2. Interview

- Ask **one question at a time**, in Korean.
- With each question, give your recommended answer and why. After the user answers, briefly evaluate it before moving on.
- Order questions so earlier answers unblock later ones (which app → where it lives → what it shares → states and edge cases).
- Before finishing, go through `.agents/skills/planning/references/question-checklist.md` and ask about anything still unresolved.

## 3. Write the spec

When the interview stops producing new decisions:

1. Copy `.agents/skills/planning/templates/spec.md` to `docs/specs/<feature-name>.md` (kebab-case).
2. Fill it in **in Korean**. Record the reasoning, not just conclusions — the spec must survive the conversation.
3. Tell the user the path.

The "기각한 대안" column matters most: it keeps the same debate from reopening halfway through implementation.
