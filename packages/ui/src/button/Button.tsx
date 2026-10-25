import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonProps = Omit<ButtonStyleOptions, "className"> & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:opacity-90",
  secondary: "border border-line bg-surface text-body hover:bg-wash",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-7 gap-1 px-3 text-[11px] leading-[16.5px]",
  md: "h-8 gap-1.5 px-3 text-[12px] leading-[18px]",
  lg: "h-10 gap-2 px-4 text-[13px] leading-[19.5px]",
};

// Link처럼 <button>이 아닌 요소에도 같은 버튼 스타일을 입힐 때 쓴다.
export function buttonClassName({ variant = "primary", size = "lg", className }: ButtonStyleOptions = {}) {
  return `inline-flex shrink-0 items-center justify-center rounded-md font-medium transition-[color,background-color,border-color,opacity] duration-200 disabled:pointer-events-none disabled:opacity-50 ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className ?? ""}`;
}

export function Button({ variant, size, type = "button", className, ...props }: ButtonProps) {
  return <button type={type} className={buttonClassName({ variant, size, className })} {...props} />;
}
