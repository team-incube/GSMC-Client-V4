# Lens: performance

Question to hold: **will this code do noticeably more work than needed, or make the page jump?**

## Look for

- **Render loops**: effects that set state and retrigger themselves.
- **Unstable deps**: objects, arrays, or functions created inline and passed as effect or memo dependencies.
- **Query churn**: query keys that change every render; missing `enabled` causing requests with incomplete params.
- **Layout shift**: `<img>` instead of `next/image`, or images without dimensions; content that pops in without reserved space.
- **Bundle size**: importing a whole library for one function; large components that could be loaded lazily but are imported eagerly on every page.
- **Heavy render work**: expensive filtering or sorting of large lists on every render. Only report when the list can realistically be large.

## Do not report

- Micro-optimizations (`useMemo` on cheap values) with no measurable effect.
