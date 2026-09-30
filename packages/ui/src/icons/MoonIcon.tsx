import type { SVGProps } from "react";

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.861 5.155A9.1 9.1 0 1 0 22.845 16.14 8.126 8.126 0 0 1 11.861 5.155Zm-4.018-.37A11.083 11.083 0 0 1 14 2.917a.992.992 0 0 1 .702 1.693 6.144 6.144 0 1 0 8.689 8.69.992.992 0 0 1 1.693.7A11.084 11.084 0 1 1 7.843 4.785Z"
      />
    </svg>
  );
}
