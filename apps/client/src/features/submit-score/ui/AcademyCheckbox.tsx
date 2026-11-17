import { TOEIC_ACADEMY_BONUS } from "../model/constants";

type AcademyCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function AcademyCheckbox({ checked, onChange, disabled }: AcademyCheckboxProps) {
  return (
    <label className={`flex w-fit items-center gap-3 ${disabled ? "opacity-50" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-line bg-surface text-white transition-colors peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-checked:[&>svg]:opacity-100"
      >
        <svg viewBox="0 0 12 12" fill="none" className="size-2.5 opacity-0 transition-opacity">
          <path
            d="M2.5 6.2 5 8.7l4.5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[13px] leading-[19.5px] text-body">
        토익사관학교 참여 <span className="text-[11px] leading-[16.5px] text-faint">+{TOEIC_ACADEMY_BONUS}점 가산</span>
      </span>
    </label>
  );
}
