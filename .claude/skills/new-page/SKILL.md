---
name: new-page
description: Use when adding a new page (route + views slice) to the client or admin app, e.g. requests like "OO 페이지 만들어줘" or "새 화면 추가".
---

# Add a new page

## 1. Decide

Ask the user if the request does not make these clear:

- **App**: `client` / `admin` / both. If both, first discuss moving the shared parts to `packages/ui` (`.claude/rules/shared-code.md`).
- **Path**: URL and route group. In client, pages with the header go inside the `(main)` group.
- **Design**: whether there is a Figma link or screenshot.

## 2. Read the Next.js docs

Next.js 16 may differ from your training data. If the page needs dynamic routes, metadata, or data loading in Server Components, read the relevant guide in `node_modules/next/dist/docs/01-app/` first.

## 3. Create files from templates

Copy the templates in `${CLAUDE_SKILL_DIR}/templates/`, replacing `__name__` (kebab-case slice name) and `__Name__` (PascalCase).

| Template | Destination |
|---|---|
| `page.tsx` | `apps/<app>/src/app/<route>/page.tsx` |
| `index.ts` | `apps/<app>/src/views/__name__/index.ts` |
| `View.tsx` | `apps/<app>/src/views/__name__/ui/__Name__Page.tsx` |

- Add `model/` only when there are constants, types, or state; add `api/` only when there are API calls.
- Remove `"use client"` from the view if it ends up with no state or events.
- Extract user actions other pages could share (buttons, forms) into `features/<name>`.

## 4. Implement

- Look for shared components in `@repo/ui` first.
- Follow `.claude/rules/styling.md`. Use color tokens only.

## 5. Verify

- If the header navigation needs a link, check `packages/ui/src/header/` and ask the user whether to add it.
- Check in code that the page does not break in light/dark mode or at mobile widths.
