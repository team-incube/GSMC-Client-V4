"use client";

import { useMyCertificationQuery, useMyGradeTopPercentileQuery } from "@/entities/certification";
import { CategorySection } from "./CategorySection";
import { ProjectSection } from "./ProjectSection";
import { ScoreSummary, ScoreSummaryError, ScoreSummarySkeleton } from "./ScoreSummary";

export function MainPage() {
  const { data: certification, isError, refetch } = useMyCertificationQuery();
  const { data: gradeTopPercentile } = useMyGradeTopPercentileQuery();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      {certification ? (
        <ScoreSummary certification={certification} gradeTopPercentile={gradeTopPercentile} />
      ) : isError ? (
        <ScoreSummaryError onRetry={() => refetch()} />
      ) : (
        <ScoreSummarySkeleton />
      )}
      <div className="flex flex-col gap-6 pt-10">
        <CategorySection />
        <ProjectSection />
      </div>
    </main>
  );
}
