import { FilterIcon } from "@repo/ui";
import type { StudentListFilter } from "../model/filter";

type StudentFilterButtonProps = {
  filter: StudentListFilter;
  onClick: () => void;
};

export function StudentFilterButton({ filter, onClick }: StudentFilterButtonProps) {
  const activeCount =
    (filter.grade != null ? 1 : 0) + (filter.classNumber != null ? 1 : 0) + (filter.name.trim() ? 1 : 0);

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-[15px] text-[13px] leading-[19.5px] font-medium text-body transition-colors duration-200 hover:bg-wash focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
    >
      <FilterIcon aria-hidden className="size-3.5" />
      필터
      {activeCount > 0 && (
        <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-brand text-[11px] leading-none font-semibold text-white">
          {activeCount}
        </span>
      )}
    </button>
  );
}
