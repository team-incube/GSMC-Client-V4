import { useRef, type KeyboardEvent } from "react";
import type { DateParts } from "../lib/format";

type DateFieldProps = {
  label: string;
  value: DateParts;
  onChange: (value: DateParts) => void;
  invalid?: boolean;
  disabled?: boolean;
};

type Part = keyof DateParts;

const PARTS: { key: Part; label: string; placeholder: string; maxLength: number; className: string }[] = [
  { key: "year", label: "연도", placeholder: "YYYY", maxLength: 4, className: "w-14 pr-1 pl-3" },
  { key: "month", label: "월", placeholder: "MM", maxLength: 2, className: "w-9 px-1" },
  { key: "day", label: "일", placeholder: "DD", maxLength: 2, className: "w-9 pr-3 pl-1" },
];

export function DateField({ label, value, onChange, invalid, disabled }: DateFieldProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, raw: string) => {
    const { key, maxLength } = PARTS[index];
    const digits = raw.replace(/\D/g, "").slice(0, maxLength);
    onChange({ ...value, [key]: digits });
    // 칸을 다 채우면 다음 칸으로 넘어간다.
    if (digits.length === maxLength) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    // 빈 칸에서 지우면 앞 칸으로 돌아간다.
    if (event.key === "Backspace" && value[PARTS[index].key] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex h-10 w-full items-center rounded-md border bg-surface p-px transition-[border-color,box-shadow] duration-200 focus-within:border-brand focus-within:shadow-[inset_0_0_0_1px_var(--brand)] ${
        invalid ? "border-danger" : "border-line"
      }`}
    >
      {PARTS.map((part, index) => (
        <span key={part.key} className="flex h-full items-center">
          {index > 0 && (
            <span aria-hidden="true" className="text-[13px] leading-[19.5px] text-faint">
              -
            </span>
          )}
          <input
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            aria-label={part.label}
            aria-invalid={invalid || undefined}
            inputMode="numeric"
            autoComplete="off"
            placeholder={part.placeholder}
            maxLength={part.maxLength}
            value={value[part.key]}
            disabled={disabled}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className={`h-full bg-transparent text-center text-base text-strong outline-none placeholder:text-faint md:text-[13px] ${part.className}`}
          />
        </span>
      ))}
    </div>
  );
}
