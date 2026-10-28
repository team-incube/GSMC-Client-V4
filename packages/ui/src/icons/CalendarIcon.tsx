import type { SVGProps } from "react";

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 13 13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.08333"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="1.625" y="2.16667" width="9.75" height="9.20833" rx="1.08333" />
      <path d="M8.66667 1.08333V3.25" />
      <path d="M4.33333 1.08333V3.25" />
      <path d="M1.625 5.41667H11.375" />
    </svg>
  );
}
