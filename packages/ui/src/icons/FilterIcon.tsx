import type { SVGProps } from "react";

export function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.25 2.33333H8.16667" />
      <path d="M5.83333 2.33333H1.75" />
      <path d="M12.25 7H7" />
      <path d="M4.66667 7H1.75" />
      <path d="M12.25 11.6667H9.33333" />
      <path d="M7 11.6667H1.75" />
      <path d="M8.16667 1.16667V3.5" />
      <path d="M4.66667 5.83333V8.16667" />
      <path d="M9.33333 10.5V12.8333" />
    </svg>
  );
}
