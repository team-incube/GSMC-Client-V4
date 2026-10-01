import type { HTMLAttributes } from "react";

type __Name__Variant = "primary" | "secondary";

type __Name__Props = {
  variant?: __Name__Variant;
} & HTMLAttributes<HTMLDivElement>;

const VARIANT_CLASSES: Record<__Name__Variant, string> = {
  primary: "bg-brand text-white",
  secondary: "border border-line bg-surface text-body",
};

export function __Name__({ variant = "primary", className, ...props }: __Name__Props) {
  return <div className={`rounded-md ${VARIANT_CLASSES[variant]} ${className ?? ""}`} {...props} />;
}
