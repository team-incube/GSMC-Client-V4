# Lens: rendering boundary

Question to hold: **does this code break where server rendering meets the client, or where packages meet apps?**

## Look for

- **Browser-only APIs during server render**: `window`, `document`, `localStorage`, `matchMedia` reachable at module scope or during render, instead of inside effects or event handlers.
- **Hydration mismatch**: render output that differs between server and client — `Date.now()`, `new Date()` formatting, `Math.random()`, locale-dependent formatting, reading `localStorage` during render.
- **`"use client"`**: missing on a component that uses state, effects, or event handlers; present on a route file or a component that needs none of those (pushes more code to the client).
- **Server/client leaks**: server-only modules or secrets imported into a client component.
- **Package boundary**: a new `@repo/ui` component that uses client features without `"use client"` (apps consume it as source via `transpilePackages`).
- **Next.js 16 APIs**: route `params` / `searchParams`, metadata, caching, and navigation APIs may differ from older versions. **Check `node_modules/next/dist/docs/` before flagging**, and cite the doc page.

## Do not report

- A `"use client"` choice that is a tradeoff rather than a bug, unless it breaks something.
