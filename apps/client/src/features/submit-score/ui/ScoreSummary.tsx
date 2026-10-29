import type { ReactNode } from "react";

type ScoreSummaryProps = {
  label: ReactNode;
  score: number;
};

export function ScoreSummary({ label, score }: ScoreSummaryProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-wash px-4 py-3 text-[13px] leading-[19.5px]">
      <span className="text-body">{label}</span>
      <span className="shrink-0 font-semibold tracking-[0.08em] text-strong">→ {score}점</span>
    </div>
  );
}
