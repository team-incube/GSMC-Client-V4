import { LANGUAGE_EXAM_TYPES, type LanguageExamType } from "../model/constants";
import { FieldLabel } from "./FieldLabel";

type ExamTypeSelectProps = {
  value: LanguageExamType;
  onChange: (value: LanguageExamType) => void;
  disabled?: boolean;
};

export function ExamTypeSelect({ value, onChange, disabled }: ExamTypeSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>시험 종류</FieldLabel>
      <div role="group" aria-label="시험 종류" className="flex gap-2">
        {LANGUAGE_EXAM_TYPES.map((examType) => {
          const selected = examType === value;
          return (
            <button
              key={examType}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => onChange(examType)}
              className={`h-9 min-w-0 flex-1 rounded-md border text-[13px] leading-[19.5px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:opacity-50 ${
                selected ? "border-transparent bg-brand text-white" : "border-line bg-surface text-body hover:bg-wash"
              }`}
            >
              {examType}
            </button>
          );
        })}
      </div>
    </div>
  );
}
