---
paths:
  - "apps/**"
  - "packages/**"
---

# Shared code and avoiding duplication

## Check before creating

Before creating a component, icon, or hook, check:

1. `packages/ui/src/index.ts`: shared components, icons, `useTheme`
2. `packages/lib/src/index.ts`: `apiClient`, `queryClient`
3. Whether the other app already has the same code (`apps/client` ↔ `apps/admin`)

If it exists, use it. If it is slightly different, extend it with a variant or prop.

## When to move code into packages

- **Code used by both apps goes to `packages/`.** Never copy it into each app.
  - UI components, icons → `packages/ui`
  - API client, shared utils → `packages/lib`
- Code used by only one app stays in that app's FSD slice. Do not promote it early "just in case".
- If you find existing duplicated code, do not fix it on the spot. Tell the user. (e.g. `views/certification` currently exists in both apps with nearly identical content)

## Import rules

- Apps never import from each other (`apps/admin` must not import `apps/client/...`).
- Import packages only through their public entries: `@repo/ui`, `@repo/ui/styles/theme.css`, `@repo/ui/theme-script`, `@repo/lib`. Never import internal paths like `@repo/ui/src/...`.
- `packages/*` never import from `apps/*`.
