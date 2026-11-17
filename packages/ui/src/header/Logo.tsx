import Link from "next/link";
import { LogoIcon } from "../icons/LogoIcon";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="메인으로 이동" draggable={false} className={`shrink-0 ${className ?? ""}`}>
      <LogoIcon className="h-5 w-auto" />
    </Link>
  );
}
