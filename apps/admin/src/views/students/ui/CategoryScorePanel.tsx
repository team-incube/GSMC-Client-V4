"use client";

import { CERTIFICATION_CATEGORIES } from "@repo/lib";
import { EyeIcon, FileTextIcon } from "@repo/ui";
import { useId, useState } from "react";
import {
  useStudentCategoryScoresQuery,
  type StudentApprovedScore,
  type StudentCategoryScore,
} from "@/entities/student";

type CategoryScorePanelProps = {
  memberId: string;
  studentName: string;
  enabled: boolean;
};

export function CategoryScorePanel({ memberId, studentName, enabled }: CategoryScorePanelProps) {
  const { data: scores, isError, refetch } = useStudentCategoryScoresQuery(memberId, enabled);
  const [selectedCode, setSelectedCode] = useState<StudentCategoryScore["code"] | null>(null);
  const detailId = useId();
  const selected = scores?.find((score) => score.code === selectedCode);

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
        <>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
            {scores
              ? scores.map((score) => (
                  <CategoryScoreCard
                    key={score.code}
                    score={score}
                    selected={score.code === selectedCode}
                    detailId={detailId}
                    onSelect={() => setSelectedCode(score.code === selectedCode ? null : score.code)}
                  />
                ))
              : CERTIFICATION_CATEGORIES.map((config) => <CategoryScoreCardSkeleton key={config.code} />)}
          </ul>
          {scores && (
            <div id={detailId} aria-live="polite">
              {selected ? (
                <ApprovedScoreList category={selected} />
              ) : (
                <p className="text-[12px] leading-[18px] text-faint">카테고리를 누르면 승인된 내역을 볼 수 있어요.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

type CategoryScoreCardProps = {
  score: StudentCategoryScore;
  selected: boolean;
  detailId: string;
  onSelect: () => void;
};

function CategoryScoreCard({ score, selected, detailId, onSelect }: CategoryScoreCardProps) {
  const percent = score.maxScore > 0 ? Math.min(100, (score.score / score.maxScore) * 100) : 0;

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-controls={detailId}
        aria-label={`${score.name} ${score.score}/${score.maxScore}점, 승인 내역 ${score.approvedScores.length}건 ${selected ? "닫기" : "보기"}`}
        className={`flex w-full flex-col rounded-lg border bg-surface px-3 py-2.5 text-left transition-colors duration-200 hover:bg-wash focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${
          selected ? "border-brand shadow-[inset_0_0_0_1px_var(--brand)]" : "border-line"
        }`}
      >
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
      </button>
    </li>
  );
}

function ApprovedScoreList({ category }: { category: StudentCategoryScore }) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="text-[11px] leading-[16.5px] font-semibold tracking-[0.08em] text-soft">
        {category.name} 승인 내역 {category.approvedScores.length}건
      </h4>
      {category.approvedScores.length === 0 ? (
        <p className="rounded-lg border border-line bg-surface px-4 py-5 text-center text-[12px] leading-[18px] text-soft">
          승인된 내역이 없어요.
        </p>
      ) : (
        <ul className="flex flex-col overflow-hidden rounded-lg border border-line bg-surface">
          {category.approvedScores.map((item) => (
            <ApprovedScoreItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ApprovedScoreItem({ item }: { item: StudentApprovedScore }) {
  return (
    <li className="flex flex-col gap-2 border-b border-linesoft px-4 py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[13px] leading-[19.5px] font-medium break-keep text-strong">{item.title}</span>
          {item.details.length > 0 && (
            <span className="text-[11px] leading-[16.5px] text-soft">{item.details.join(" · ")}</span>
          )}
        </div>
        {item.valueLabel && (
          <span className="shrink-0 text-[12px] leading-[18px] font-semibold text-brand">{item.valueLabel}</span>
        )}
      </div>
      {item.content && (
        <p className="rounded-md bg-wash px-3 py-2 text-[12px] leading-[19px] whitespace-pre-wrap text-body">
          {item.content}
        </p>
      )}
      {item.files.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {item.files.map((file) => (
            <li key={file.uri}>
              <a
                href={file.uri}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${file.name} 새 창에서 보기`}
                className="inline-flex max-w-60 items-center gap-1.5 rounded-md border border-line bg-wash px-2.5 py-1 text-[11px] leading-[16.5px] text-body transition-colors hover:border-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              >
                <FileTextIcon aria-hidden className="size-3 shrink-0 text-soft" />
                <span className="truncate">{file.name}</span>
                <EyeIcon aria-hidden className="size-3 shrink-0 text-faint" />
              </a>
            </li>
          ))}
        </ul>
      )}
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
