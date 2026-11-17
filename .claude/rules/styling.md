---
paths:
  - "**/*.tsx"
  - "**/*.css"
---

# Styling

Tailwind CSS v4. Design tokens live in `packages/ui/src/styles/theme.css`, imported by each app's `globals.css`.

## Colors: tokens required

Tokens define both light and dark values, so using them handles dark mode automatically.

| Token | Use |
|---|---|
| `page` | page background |
| `surface` | card and input background |
| `wash` | hover background, subtle areas |
| `line` / `linesoft` | borders / subtle dividers |
| `strong` | headings, emphasized text |
| `body` | body text |
| `soft` / `faint` | secondary text / placeholder, disabled |
| `brand` / `branddark` / `brandwash` | primary / strong accent / tinted background |
| `danger` / `caution` | error / warning |

```tsx
// Good
<p className="text-body border-line bg-surface" />
<div className="shadow-[inset_0_0_0_1px_var(--brand)]" />

// Bad: hardcoded hex breaks in dark mode
<p className="text-[#334155] bg-[#f8fafc]" />
```

- If a needed color has no token, do not hardcode a hex value. Ask the user whether to add a token.
- Use the `dark:` variant only when tokens cannot solve it (e.g. swapping icons).

## Typography

- `theme.css` defines tokens such as `text-h1` and `text-body-2`. Use a token when one matches the Figma values.
- If no token matches, use the Figma values as arbitrary values (`text-[15px] leading-[22.5px]`).
- The font (Pretendard) is set at the app root. Do not set it again in components.

## Other

- Mobile first: write base styles for mobile, then extend with `sm:` / `md:` / `lg:`.
- For recurring SVGs, check the icons in `@repo/ui` first.
- Give interactive elements accessibility attributes such as `aria-label`. Required for icon-only buttons.
