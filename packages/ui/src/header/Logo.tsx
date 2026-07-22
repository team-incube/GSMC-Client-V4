import { LogoMarkIcon } from "../icons/LogoMarkIcon";
import { LogoWordmarkIcon } from "../icons/LogoWordmarkIcon";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-brand ${className ?? ""}`}>
      <LogoMarkIcon className="h-5 w-auto" />
      <LogoWordmarkIcon className="h-[16.62px] w-auto" />
    </div>
  );
}
