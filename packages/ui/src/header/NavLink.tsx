"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export function NavLink({ href, label, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      draggable={false}
      className={`text-body-1 font-semibold flex h-10 shrink-0 items-center rounded-md px-3 transition-colors duration-200 ${
        isActive ? "text-brand" : "text-body hover:text-brand"
      } ${className ?? ""}`}
    >
      <span className="relative">
        {label}
        {isActive && (
          <span className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-brand" />
        )}
      </span>
    </Link>
  );
}
