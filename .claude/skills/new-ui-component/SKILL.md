---
name: new-ui-component
description: Use when adding a shared component or icon used by both apps to packages/ui.
---

# Add a shared UI component

## 1. Confirm it is really shared

- If `packages/ui/src/index.ts` already has something similar, extend it with a variant or prop instead.
- If only one app uses it or it depends on page-specific data, create it in that app's FSD slice, not in `packages/ui`.

## 2. Create files from templates

Copy from `${CLAUDE_SKILL_DIR}/templates/`, replacing `__name__` (lowercase folder name) and `__Name__` (PascalCase).

| Kind | Template | Destination |
|---|---|---|
| Component | `Component.tsx` | `packages/ui/src/__name__/__Name__.tsx` |
| Icon | `Icon.tsx` | `packages/ui/src/icons/__Name__Icon.tsx` |

Conventions for both are in `.claude/rules/ui-package.md`. In short: extend native HTML attributes, merge `className`, union + `Record` for variants, color tokens only, `"use client"` only with state or events.

## 3. Add the export

Add the export to `packages/ui/src/index.ts`, next to exports of the same kind.

```ts
export { __Name__ } from "./__name__/__Name__";
```

## 4. Verify

- Type check both apps: `npx tsc --noEmit -p apps/client` and `npx tsc --noEmit -p apps/admin`.
- If app code already has a duplicate implementation of the same role, tell the user and ask whether to replace it.
