# Lens: correctness

Question to hold: **does this code do the wrong thing for some input, timing, or state?**

## Look for

- **Async**: a Promise created but not awaited; a failure path that silently succeeds; `catch` that swallows the error and shows nothing to the user.
- **Query states**: a TanStack Query result used without handling `isPending` / `isError`; `data` accessed as if always defined.
- **Effects**: `useEffect` with missing dependencies; no cleanup for event listeners, timers, `IntersectionObserver`, or subscriptions; effects that should be event handlers.
- **Stale values**: closures capturing old state in timers or callbacks; state updates that depend on previous state but don't use the updater form.
- **Races**: fast input changes (search, filters, tabs) where an older response can overwrite a newer one.
- **Lists**: `key` from array index on lists that reorder, filter, or insert; duplicate keys.
- **Inputs**: switching between controlled and uncontrolled (`value` becoming `undefined`).
- **API data**: `null` / `undefined` / empty array not handled before `.map`, `.length`, or property access.
- **Edges**: off-by-one, empty list, first and last item, very long text.

## Do not report

- Style, naming, or formatting.
- Hypothetical problems with no input or timing that triggers them.
