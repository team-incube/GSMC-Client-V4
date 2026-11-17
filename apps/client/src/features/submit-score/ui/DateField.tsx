import { CalendarIcon } from "@repo/ui";
import { toDateParts, todayIsoDate, toIsoDate, type DateParts } from "../lib/format";

type DateFieldProps = {
  label: string;
  value: DateParts;
  onChange: (value: DateParts) => void;
  invalid?: boolean;
  disabled?: boolean;
};

export function DateField({ label, value, onChange, invalid, disabled }: DateFieldProps) {
  const isoDate = toIsoDate(value) ?? "";

  return (
    <span className={`relative block w-full ${disabled ? "opacity-50" : ""}`}>
      <input
        type="date"
        aria-label={label}
        aria-invalid={invalid || undefined}
        // 활동은 이미 끝난 일이므로 오늘 이후는 고를 수 없다.
        max={todayIsoDate()}
        value={isoDate}
        disabled={disabled}
        onChange={(event) => onChange(toDateParts(event.target.value))}
        // 달력 아이콘뿐 아니라 칸 어디를 눌러도 달력이 열린다.
        onClick={(event) => {
          try {
            event.currentTarget.showPicker();
          } catch {
            // showPicker를 지원하지 않는 브라우저는 직접 입력한다.
          }
        }}
        // 비어 있을 때는 파일 첨부 문구처럼 soft, 고른 뒤에는 드롭다운 값처럼 strong으로 보인다.
        // 브라우저 기본 달력 아이콘은 색을 바꿀 수 없어 숨기고, 같은 자리에 CalendarIcon을 겹친다.
        className={`h-10 w-full cursor-pointer rounded-md border bg-surface pr-9 pl-3.25 text-base outline-none transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[inset_0_0_0_1px_var(--brand)] disabled:cursor-default md:text-[13px] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-9 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 ${
          isoDate ? "text-strong" : "text-soft"
        } ${invalid ? "border-danger" : "border-line"}`}
      />
      <CalendarIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.25 size-3.5 -translate-y-1/2 text-soft"
      />
    </span>
  );
}
