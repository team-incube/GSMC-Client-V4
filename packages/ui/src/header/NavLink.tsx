"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-body-2 relative shrink-0 rounded-full px-3 py-2 ${
        isActive ? "text-brand" : "text-body"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand" />
      )}
    </Link>
  );
}
