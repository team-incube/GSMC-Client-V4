---
paths:
  - "packages/ui/**"
---

# @repo/ui package

Holds components, icons, theme, and design tokens shared by both apps. It is consumed as source without a build step, and each app registers it via `transpilePackages: ["@repo/ui"]` in `next.config.ts`.

## File layout

```
src/
├── <component>/Component.tsx   # button/Button.tsx, input/Input.tsx
├── icons/XxxIcon.tsx
├── theme/
├── styles/theme.css            # design tokens
└── index.ts                    # public API
```

- **Always add an export to `src/index.ts`** for every new component or icon. Without it, apps cannot import it.
- Folders are lowercase kebab-case; files are PascalCase.

## Component pattern

Follow `Button.tsx`.

```tsx
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:opacity-90",
  secondary: "border border-line bg-surface text-body hover:bg-wash",
};

export function Button({ variant = "primary", type = "button", className, ...props }: ButtonProps) {
  return <button type={type} className={`... ${VARIANT_CLASSES[variant]} ${className ?? ""}`} {...props} />;
}
```

- Extend native HTML attributes via `...HTMLAttributes` and merge the incoming `className`.
- Define variants with a union type + `Record` map, not `enum`.
- Add `"use client"` at the top only for components that use `useState`, event handlers, or browser APIs.
- No domain logic (page-specific data, API calls). Such components belong in the app's FSD slice.

## Icons

- Accept `props: SVGProps<SVGSVGElement>` and spread them onto `<svg {...props}>`. Callers set the size with `className="size-4"`.
- Use `stroke="currentColor"` or `fill="currentColor"` so the color follows the text color.
