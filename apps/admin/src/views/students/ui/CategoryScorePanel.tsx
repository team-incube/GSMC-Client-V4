"use client";

import { CERTIFICATION_CATEGORIES } from "@repo/lib";
import { useStudentCategoryScoresQuery, type StudentCategoryScore } from "@/entities/student";

type CategoryScorePanelProps = {
  memberId: string;
  studentName: string;
  enabled: boolean;
};

export function CategoryScorePanel({ memberId, studentName, enabled }: CategoryScorePanelProps) {
  const { data: scores, isError, refetch } = useStudentCategoryScoresQuery(memberId, enabled);

  return (
    <div className="flex flex-col gap-3 border-b border-line bg-wash/20 px-5 py-5">
      <p className="text-[10px] leading-[15px] font-semibold tracking-[0.08em] text-soft uppercase">
        카테고리별 점수 — {studentName}
      </p>
      {isError ? (
        <p className="flex items-center gap-2 py-6 text-[12px] text-soft">
          점수를 불러오지 못했어요.
          <button type="button" onClick={() => refetch()} className="font-medium text-brand hover:underline">
            다시 시도
          </button>
        </p>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
          {scores
            ? scores.map((score) => <CategoryScoreCard key={score.code} score={score} />)
            : CERTIFICATION_CATEGORIES.map((config) => <CategoryScoreCardSkeleton key={config.code} />)}
        </ul>
      )}
    </div>
  );
}

function CategoryScoreCard({ score }: { score: StudentCategoryScore }) {
  const percent = score.maxScore > 0 ? Math.min(100, (score.score / score.maxScore) * 100) : 0;

  return (
    <li className="flex flex-col rounded-lg border border-line bg-surface px-3 py-2.5">
      <span className="truncate text-[10px] leading-[12.5px] tracking-[0.08em] text-faint">{score.name}</span>
      <span className="pt-1.5 text-[16px] leading-4 font-semibold text-strong">{score.score}</span>
      <span className="pt-0.5 text-[10px] leading-[15px] text-faint">/ {score.maxScore}점</span>
      <div
        role="progressbar"
        aria-label={`${score.name} 점수`}
        aria-valuemin={0}
        aria-valuemax={score.maxScore}
        aria-valuenow={score.score}
        className="mt-2 h-1 overflow-hidden rounded-full bg-wash"
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
    </li>
  );
}

function CategoryScoreCardSkeleton() {
  return (
    <li aria-hidden className="flex h-[85.5px] flex-col gap-2 rounded-lg border border-line bg-surface px-3 py-2.5">
      <span className="h-2.5 w-3/5 animate-pulse rounded bg-wash" />
      <span className="h-4 w-6 animate-pulse rounded bg-wash" />
      <span className="mt-auto h-1 w-full animate-pulse rounded-full bg-wash" />
    </li>
  );
}
