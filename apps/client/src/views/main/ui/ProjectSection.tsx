import Link from "next/link";
import { PlusIcon, buttonClassName } from "@repo/ui";
import { isForbiddenError, useMyProjectsQuery } from "@/entities/project";
import { ProjectCard } from "./ProjectCard";
import { SectionCard, SectionMessage } from "./SectionCard";

const GRID_CLASS = "grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-3";

export function ProjectSection() {
  const { data, isPending, isError, error, refetch } = useMyProjectsQuery();

  return (
    <SectionCard
      title="내 프로젝트"
      action={
        // TODO: 프로젝트 작성 페이지가 생기면 경로를 바꾼다.
        <Link href="/projects" className={buttonClassName({ size: "sm" })}>
          <PlusIcon aria-hidden="true" className="size-2.5" />
          새 프로젝트
        </Link>
      }
    >
      {isPending ? (
        <ul aria-hidden="true" className={GRID_CLASS}>
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index} className="h-43.5 animate-pulse rounded-lg bg-wash" />
          ))}
        </ul>
      ) : isError ? (
        isForbiddenError(error) ? (
          <SectionMessage message="학생 계정만 참여 프로젝트를 볼 수 있습니다." />
        ) : (
          <SectionMessage message="프로젝트를 불러오지 못했습니다." onRetry={() => refetch()} />
        )
      ) : data.length === 0 ? (
        <SectionMessage message="참여 중인 프로젝트가 없습니다." />
      ) : (
        <ul className={GRID_CLASS}>
          {data.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
