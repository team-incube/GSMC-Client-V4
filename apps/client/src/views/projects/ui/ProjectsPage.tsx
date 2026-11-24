"use client";

import { Button } from "@repo/ui";
import { isForbiddenError, ProjectCard, useMyProjectsQuery } from "@/entities/project";

const GRID_CLASS = "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4";

export function ProjectsPage() {
  const { data, isPending, isError, error, refetch } = useMyProjectsQuery();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="flex items-baseline gap-2 pb-6">
        {/* text-h1 자간(-0.25rem)이 공백을 먹어서 단어 간격을 보정한다. */}
        <h1 className="text-h1 text-strong [word-spacing:0.25rem]">내 프로젝트</h1>
        {data && data.length > 0 && <span className="text-[14px] leading-5 text-soft">{data.length}개</span>}
      </header>
      {isPending ? (
        <ul aria-hidden="true" className={GRID_CLASS}>
          {Array.from({ length: 8 }, (_, index) => (
            <li key={index} className="h-43.5 animate-pulse rounded-lg bg-wash" />
          ))}
        </ul>
      ) : isError ? (
        isForbiddenError(error) ? (
          <ProjectsMessage message="학생 계정만 참여 프로젝트를 볼 수 있습니다." />
        ) : (
          <ProjectsMessage message="프로젝트를 불러오지 못했습니다." onRetry={() => refetch()} />
        )
      ) : data.length === 0 ? (
        <ProjectsMessage message="참여 중인 프로젝트가 없습니다." />
      ) : (
        <ul className={GRID_CLASS}>
          {data.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      )}
    </main>
  );
}

type ProjectsMessageProps = {
  message: string;
  onRetry?: () => void;
};

function ProjectsMessage({ message, onRetry }: ProjectsMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface px-6 py-10">
      <p className="text-[14px] text-soft">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
