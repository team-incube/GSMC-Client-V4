import { FieldLabel } from "./FieldLabel";

type CourseSelectProps = {
  courses: readonly string[];
  selectedIndex: number | null;
  onChange: (index: number | null) => void;
  disabled?: boolean;
};

export function CourseSelect({ courses, selectedIndex, onChange, disabled }: CourseSelectProps) {
  return (
    <div className="flex flex-col gap-3">
      <FieldLabel>완료 코스</FieldLabel>
      <div role="group" aria-label="완료 코스" className="grid grid-cols-4 gap-2">
        {courses.map((course, index) => {
          const selected = index === selectedIndex;
          const done = selectedIndex !== null && index < selectedIndex;
          return (
            <button
              key={course}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => onChange(selected ? null : index)}
              className={`h-10 rounded-md border text-[13px] leading-[19.5px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:opacity-50 ${
                selected
                  ? "border-transparent bg-brand text-white"
                  : done
                    ? "border-line bg-wash text-soft"
                    : "border-line bg-surface text-body hover:bg-wash"
              }`}
            >
              {done && <span className="sr-only">완료: </span>}
              {course}
            </button>
          );
        })}
      </div>
    </div>
  );
}
