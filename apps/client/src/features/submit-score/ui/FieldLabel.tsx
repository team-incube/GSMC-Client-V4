import type { ReactNode } from "react";

type FieldLabelProps = {
  children: ReactNode;
};

export function FieldLabel({ children }: FieldLabelProps) {
  return <p className="text-[11px] leading-[16.5px] font-medium tracking-[0.08em] text-soft">{children}</p>;
}
