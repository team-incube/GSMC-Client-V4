---
paths:
  - "apps/*/src/**"
---

# FSD structure

Each app's `src/` follows Feature-Sliced Design. The FSD `pages` layer is named `views` to avoid colliding with the Next.js Pages Router.

```
src/
├── app/        # routing, layouts, metadata, providers only
├── views/      # page-level composition
├── widgets/    # large sections reused across pages (create when needed)
├── features/   # user actions (login button, forms, mutations)
├── entities/   # domain types, API functions, query hooks (create when needed)
└── shared/     # app-specific utils and constants (create when needed)
```

## Import direction

```
app → views → widgets → features → entities → shared → @repo/*
```

- A layer may import only from layers to its right. Never import leftward.
- Never import another slice in the same layer. e.g. `features/login` must not import `features/signup`.

## Slice layout

```
views/faq/
├── index.ts        # public API — the only entry point for outside imports
├── ui/             # components (FaqPage.tsx, FaqItem.tsx)
├── model/          # types, constants, state, query hooks
├── api/            # API call functions
└── lib/            # slice-specific utils
```

- Create only the segments you need. Do not scaffold empty folders.
- Outside a slice, import only through `index.ts` (`@/views/faq`). Never import internal paths like `@/views/faq/ui/FaqItem`.
- Write components as named exports (`export function FaqPage`).

## app layer

Route files only render a view. No logic, state, or markup.

```tsx
// app/(main)/faq/page.tsx
import { FaqPage } from "@/views/faq";

export default function Page() {
  return <FaqPage />;
}
```
