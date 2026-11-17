import type { ReactNode } from "react";
import type { PendingScore } from "@/entities/score";
import { toSubmissionSummary } from "@/features/review-score";

type ReviewTableProps = {
  scores: PendingScore[] | undefined;
  // 이전 필터의 결과를 보여 주는 중이면 true. 새 결과로 오인하거나 조작하지 않게 막는다.
  isUpdating: boolean;
  isError: boolean;
  onRetry: () => void;
  onSelect: (score: PendingScore) => void;
};

const COLUMN_COUNT = 5;

const formatClassInfo = ({ grade, classNumber, number }: PendingScore["student"]) =>
  grade == null || classNumber == null || number == null ? "-" : `${grade}학년 ${classNumber}반 ${number}번`;

export function ReviewTable({ scores, isUpdating, isError, onRetry, onSelect }: ReviewTableProps) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-line bg-surface">
      <table aria-busy={isUpdating} className="w-full min-w-[720px] table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-wash text-[11px] leading-[16.5px] font-medium tracking-[0.08em] text-soft uppercase">
            <th scope="col" className="w-[15%] px-5 py-4 font-medium">
              학생
            </th>
            <th scope="col" className="w-[13%] px-4 py-4 font-medium">
              카테고리
            </th>
            <th scope="col" className="w-[32%] px-4 py-4 font-medium">
              제출 내용
            </th>
            <th scope="col" className="w-[25%] px-4 py-4 font-medium">
              파일
            </th>
            <th scope="col" className="px-4 py-4 font-medium">
              제출일
            </th>
          </tr>
        </thead>
        <tbody
          inert={isUpdating}
          className={`transition-opacity duration-200 motion-reduce:transition-none ${isUpdating ? "opacity-40" : ""}`}
        >
          {scores ? (
            scores.length > 0 ? (
              scores.map((score) => <ReviewRow key={score.scoreId} score={score} onSelect={onSelect} />)
            ) : (
              <MessageRow>심사를 기다리는 제출 건이 없어요.</MessageRow>
            )
          ) : isError ? (
            <MessageRow>
              심사 요청을 불러오지 못했어요.{" "}
              <button type="button" onClick={onRetry} className="font-medium text-brand hover:underline">
                다시 시도
              </button>
            </MessageRow>
          ) : (
            Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} />)
          )}
        </tbody>
      </table>
    </div>
  );
}

function ReviewRow({ score, onSelect }: { score: PendingScore; onSelect: (score: PendingScore) => void }) {
  const summary = toSubmissionSummary(score);

  return (
    <tr
      onClick={() => onSelect(score)}
      className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-wash"
    >
      <td className="h-[63px] px-5 py-2">
        <span className="block truncate text-[13px] leading-[19.5px] font-medium text-strong">{score.student.name}</span>
        <span className="block truncate text-[11px] leading-[16.5px] tracking-[0.08em] text-faint">
          {formatClassInfo(score.student)}
        </span>
      </td>
      <td className="px-4">
        <span className="inline-block max-w-full truncate rounded-full bg-wash px-2 py-0.5 align-middle text-[11px] leading-[16.5px] font-medium text-body">
          {score.categoryName}
        </span>
      </td>
      <td className="px-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(score);
          }}
          aria-label={`${score.student.name} ${score.categoryName} ${summary} 심사하기`}
          className="block max-w-full truncate rounded text-left text-[13px] leading-[19.5px] text-body focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          {summary}
        </button>
      </td>
      <td className="truncate px-4 text-[12px] leading-[18px] text-soft">
        {score.files.length === 0
          ? "-"
          : score.files.length === 1
            ? score.files[0].originalName
            : `${score.files[0].originalName} 외 ${score.files.length - 1}개`}
      </td>
      <td className="px-4 text-[12px] leading-[18px] whitespace-nowrap text-soft">{score.submittedAt}</td>
    </tr>
  );
}

function MessageRow({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td colSpan={COLUMN_COUNT} className="px-5 py-16 text-center text-[13px] break-keep text-soft">
        {children}
      </td>
    </tr>
  );
}

const SKELETON_WIDTHS = [48, 56, 160, 120, 72];

function SkeletonRow() {
  return (
    <tr aria-hidden className="border-b border-line last:border-b-0">
      {SKELETON_WIDTHS.map((width, i) => (
        <td key={i} className="h-[63px] px-4 first:px-5">
          <span className="inline-block h-3 max-w-full animate-pulse rounded bg-wash" style={{ width }} />
        </td>
      ))}
    </tr>
  );
}
