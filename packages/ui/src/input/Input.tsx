import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = {
  label?: ReactNode;
  unit?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, unit, className, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col items-start gap-2">
      {label && (
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-soft">
          {label}
        </span>
      )}
      <span className="relative h-10 w-full">
        <input
          className={`h-10 w-full rounded-md border border-line bg-surface py-px pl-3.5 text-[13px] text-body placeholder:text-faint ${
            unit ? "pr-12" : "pr-3.5"
          } ${className ?? ""}`}
          {...props}
        />
        {unit && (
          <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs tracking-[0.08em] text-faint">
            {unit}
          </span>
        )}
      </span>
    </label>
  );
}
