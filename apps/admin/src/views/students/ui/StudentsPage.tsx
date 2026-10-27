"use client";

import { useDeferredValue, useMemo, useState, type SVGProps } from "react";
import { useStudentsQuery } from "@/entities/student";
import { ExportScoreSheetButton } from "@/features/export-score-sheet";
import { INITIAL_FILTER, type StudentListFilter } from "../model/filter";
import { StudentFilterModal } from "./StudentFilterModal";
import { StudentTable } from "./StudentTable";

export function StudentsPage() {
  const [filter, setFilter] = useState<StudentListFilter>(INITIAL_FILTER);
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: students, isError, refetch } = useStudentsQuery({
    grade: filter.grade,
    classNumber: filter.classNumber,
  });

  // 이름은 받아 둔 목록에서 바로 거른다. 입력이 잦아 서버 요청 대신 화면에서 처리한다.
  const keyword = useDeferredValue(filter.name.trim());
  const visibleStudents = useMemo(
    () => (keyword ? students?.filter((student) => student.name.includes(keyword)) : students),
    [students, keyword],
  );

  const activeFilterCount =
    (filter.grade != null ? 1 : 0) + (filter.classNumber != null ? 1 : 0) + (filter.name.trim() ? 1 : 0);

  return (
    <main className="mx-auto w-full max-w-[1425px] px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <h1 className="text-[20px] leading-[30px] font-semibold text-strong">학생 전체 조회</h1>
          {visibleStudents && (
            <span className="text-[12px] leading-[18px] tracking-[0.08em] text-soft">{visibleStudents.length}명</span>
          )}
        </div>
        <ExportScoreSheetButton grade={filter.grade} classNumber={filter.classNumber} />
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-[15px] text-[13px] leading-[19.5px] font-medium text-body transition-colors duration-200 hover:bg-wash focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          <FilterIcon className="size-3.5" />
          필터
          {activeFilterCount > 0 && (
            <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-brand text-[11px] leading-none font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="pt-5">
        <StudentTable students={visibleStudents} isError={isError} onRetry={() => refetch()} />
      </div>

      <StudentFilterModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filter={filter}
        onFilterChange={setFilter}
        onReset={() => setFilter(INITIAL_FILTER)}
      />
    </main>
  );
}

function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12.25 2.33333H8.16667" />
      <path d="M5.83333 2.33333H1.75" />
      <path d="M12.25 7H7" />
      <path d="M4.66667 7H1.75" />
      <path d="M12.25 11.6667H9.33333" />
      <path d="M7 11.6667H1.75" />
      <path d="M8.16667 1.16667V3.5" />
      <path d="M4.66667 5.83333V8.16667" />
      <path d="M9.33333 10.5V12.8333" />
    </svg>
  );
}
