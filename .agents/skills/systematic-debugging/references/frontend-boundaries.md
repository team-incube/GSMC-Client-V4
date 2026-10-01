# Frontend boundaries

Most bugs in this project happen where data crosses a boundary. Log or inspect what enters and leaves each boundary **once**, find the one where the value goes wrong, then investigate only that one.

| Boundary | What goes wrong | How to inspect |
|---|---|---|
| `packages/*` → app | Package change not picked up; missing export in `index.ts`; package uses client features without `"use client"` | Check `packages/ui/src/index.ts`; `transpilePackages` in `next.config.ts`; restart the dev server |
| Server render → client hydration | Hydration mismatch; browser API at module scope; different output on server and client | Next.js dev overlay and browser console hydration warning; search for `window`, `localStorage`, `Date`, `Math.random` in render |
| Theme init → first paint | Wrong theme flashes; `dark` class missing | `themeInitScript` in the root layout; `<html>` class in devtools; `theme.css` token values |
| CSS tokens → computed style | Color wrong only in dark mode; arbitrary value overrides a token | Devtools computed styles; check the class uses a token, not a hex value |
| `apiClient` → API | Wrong `baseURL` (`NEXT_PUBLIC_API_URL`); request shape; status code | Browser Network tab: request URL, payload, response |
| API → React Query cache | Stale data; wrong query key; data shape differs from the type | React Query Devtools (enabled in each app's `providers.tsx`) |
| Cache → component | `undefined` during loading; state not reset on route change | Log `isPending` / `isError` / `data` at the top of the component |

## Tracing backward

When the error surfaces deep inside a component:

1. Find the line that throws or renders wrong.
2. Ask what passed it the bad value: props, hook, context, or query.
3. Keep going up one level at a time until you reach the source.
4. Fix at the source. Optionally add a guard where the value enters the app (e.g. normalize API responses), so the same bug cannot come back through another path.

When manual tracing stalls, log right **before** the suspicious operation with enough context (props, route, theme, `new Error().stack`), reproduce once, then remove the logging.
