import type { MyCertification } from "@/entities/certification";
import { ProgressBar } from "./ProgressBar";
import { SectionMessage } from "./SectionCard";

type ScoreSummaryProps = {
  certification: MyCertification;
};

export function ScoreSummary({ certification }: ScoreSummaryProps) {
  const { studentName, totalScore, maxScore } = certification;

  return (
    <section className="border-b border-line pb-10">
      <h1 className="text-body-2 text-soft">{studentName}님의 인증제 점수</h1>
      <p className="flex items-baseline gap-2 pt-2 text-strong">
        <span className="text-[64px] leading-16 font-bold tracking-[-3px]">{totalScore}</span>
        <span className="text-[24px] leading-6 tracking-[-3px] whitespace-pre text-faint">{`/  ${maxScore}`}</span>
      </p>
      <ProgressBar value={totalScore} max={maxScore} label="인증제 총점" className="mt-5" />
    </section>
  );
}

type ScoreSummaryErrorProps = {
  onRetry: () => void;
};

export function ScoreSummaryError({ onRetry }: ScoreSummaryErrorProps) {
  return (
    <section className="border-b border-line">
      <SectionMessage message="인증제 점수를 불러오지 못했습니다." onRetry={onRetry} />
    </section>
  );
}

export function ScoreSummarySkeleton() {
  return (
    <section aria-hidden="true" className="border-b border-line pb-10">
      <div className="h-4 w-32 animate-pulse rounded bg-wash" />
      <div className="mt-4 h-14 w-40 animate-pulse rounded bg-wash" />
      <div className="mt-6 h-1 animate-pulse rounded-full bg-wash" />
    </section>
  );
}
