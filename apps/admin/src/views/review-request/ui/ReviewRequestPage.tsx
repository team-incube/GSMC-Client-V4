"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { PendingScore } from "@/entities/score";
import { ReviewScoreModal } from "@/features/review-score";
import {
  INITIAL_FILTER,
  StudentFilterButton,
  StudentFilterModal,
  type StudentListFilter,
} from "@/features/student-filter";
import { usePendingScoresQuery } from "../model/queries";
import { ReviewTable } from "./ReviewTable";

export function ReviewRequestPage() {
  const [filter, setFilter] = useState<StudentListFilter>(INITIAL_FILTER);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<PendingScore | null>(null);

  const { data, isError, isPlaceholderData, refetch } = usePendingScoresQuery({
    grade: filter.grade,
    classNumber: filter.classNumber,
  });

  // 이름은 받아 둔 목록에서 바로 거른다. 입력이 잦아 서버 요청 대신 화면에서 처리한다.
  const keyword = useDeferredValue(filter.name.trim());
  const visibleScores = useMemo(
    () => (keyword ? data?.scores.filter((score) => score.student.name.includes(keyword)) : data?.scores),
    [data, keyword],
  );

  const hasFailure = !isPlaceholderData && (data?.failedCount ?? 0) > 0;

  return (
    <main className="mx-auto w-full max-w-[1425px] px-4 py-8 sm:px-8">
      <div className="flex items-center gap-3 whitespace-nowrap">
        <h1 className="text-[20px] leading-[30px] font-semibold text-strong">심사 요청</h1>
        {visibleScores && !isPlaceholderData && (
          <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] leading-[16.5px] font-semibold text-white">
            {visibleScores.length}건 대기
          </span>
        )}
      </div>

      <div className="pt-6">
        <StudentFilterButton filter={filter} onClick={() => setFilterOpen(true)} />
      </div>

      {hasFailure && (
        <p role="status" className="pt-5 text-[13px] leading-[19.5px] break-keep text-caution">
          일부 학생의 심사 요청을 불러오지 못했어요.{" "}
          <button type="button" onClick={() => refetch()} className="font-medium text-brand hover:underline">
            다시 시도
          </button>
        </p>
      )}

      <div className="pt-5">
        <ReviewTable
          scores={visibleScores}
          isUpdating={isPlaceholderData}
          isError={isError}
          onRetry={() => refetch()}
          onSelect={setSelected}
        />
      </div>

      <StudentFilterModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filter={filter}
        onFilterChange={setFilter}
        onReset={() => setFilter(INITIAL_FILTER)}
      />

      {selected && (
        <ReviewScoreModal
          key={selected.scoreId}
          score={selected}
          open
          onOpenChange={(open) => !open && setSelected(null)}
        />
      )}
    </main>
  );
}
