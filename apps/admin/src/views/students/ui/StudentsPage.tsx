"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useStudentsQuery } from "@/entities/student";
import { ExportScoreSheetButton } from "@/features/export-score-sheet";
import {
  INITIAL_FILTER,
  StudentFilterButton,
  StudentFilterModal,
  type StudentListFilter,
} from "@/features/student-filter";
import { StudentTable } from "./StudentTable";

export function StudentsPage() {
  const [filter, setFilter] = useState<StudentListFilter>(INITIAL_FILTER);
  const [filterOpen, setFilterOpen] = useState(false);

  // 필터를 바꾸면 새 결과가 올 때까지 이전 결과를 placeholder로 보여 준다. 그동안은 갱신 중으로 표시한다.
  const { data: students, isError, isPlaceholderData, refetch } = useStudentsQuery({
    grade: filter.grade,
    classNumber: filter.classNumber,
  });

  // 이름은 받아 둔 목록에서 바로 거른다. 입력이 잦아 서버 요청 대신 화면에서 처리한다.
  const keyword = useDeferredValue(filter.name.trim());
  const visibleStudents = useMemo(
    () => (keyword ? students?.filter((student) => student.name.includes(keyword)) : students),
    [students, keyword],
  );

  const hasMissingScore = !isPlaceholderData && (students?.some((student) => student.totalScore == null) ?? false);

  return (
    <main className="mx-auto w-full max-w-[1425px] px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <h1 className="text-[20px] leading-[30px] font-semibold text-strong">학생 전체 조회</h1>
          {visibleStudents && !isPlaceholderData && (
            <span className="text-[12px] leading-[18px] tracking-[0.08em] text-soft">{visibleStudents.length}명</span>
          )}
        </div>
        <ExportScoreSheetButton grade={filter.grade} classNumber={filter.classNumber} />
      </div>

      <div className="pt-6">
        <StudentFilterButton filter={filter} onClick={() => setFilterOpen(true)} />
      </div>

      {hasMissingScore && (
        <p role="status" className="pt-5 text-[13px] leading-[19.5px] break-keep text-caution">
          일부 학생의 점수를 불러오지 못했어요.{" "}
          <button type="button" onClick={() => refetch()} className="font-medium text-brand hover:underline">
            다시 시도
          </button>
        </p>
      )}

      <div className="pt-5">
        <StudentTable
          students={visibleStudents}
          isUpdating={isPlaceholderData}
          isError={isError}
          onRetry={() => refetch()}
        />
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
