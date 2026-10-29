import type { SVGProps } from "react";

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M1.625 3.25H11.375" />
      <path d="M10.2917 3.25V10.8333C10.2917 11.375 9.75 11.9167 9.20833 11.9167H3.79167C3.25 11.9167 2.70833 11.375 2.70833 10.8333V3.25" />
      <path d="M4.33333 3.25V2.16667C4.33333 1.625 4.875 1.08333 5.41667 1.08333H7.58333C8.125 1.08333 8.66667 1.625 8.66667 2.16667V3.25" />
      <path d="M5.41667 5.95833V9.20833" />
      <path d="M7.58333 5.95833V9.20833" />
    </svg>
  );
}
