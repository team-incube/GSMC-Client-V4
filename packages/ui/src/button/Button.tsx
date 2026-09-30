import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:opacity-90",
  secondary: "border border-line bg-surface text-body hover:bg-wash",
};

export function Button({ variant = "primary", type = "button", className, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-[13px] leading-[19.5px] font-medium transition-[color,background-color,border-color,opacity] duration-200 disabled:pointer-events-none disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}
