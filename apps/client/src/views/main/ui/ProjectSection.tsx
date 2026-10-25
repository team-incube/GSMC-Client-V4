import Link from "next/link";
import { PlusIcon } from "@repo/ui";
import { useMyProjectsQuery } from "@/entities/project";
import { ProjectCard } from "./ProjectCard";
import { SectionCard, SectionMessage } from "./SectionCard";

const GRID_CLASS = "grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-3";

export function ProjectSection() {
  const { data, isPending, isError, refetch } = useMyProjectsQuery();

  return (
    <SectionCard
      title="내 프로젝트"
      action={
        // TODO: 프로젝트 작성 페이지가 생기면 경로를 바꾼다.
        <Link
          href="/projects"
          className="inline-flex h-7 items-center gap-1 rounded-md bg-brand px-3 text-[11px] leading-[16.5px] font-medium text-white transition-opacity duration-200 hover:opacity-90"
        >
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
        <SectionMessage message="프로젝트를 불러오지 못했습니다." onRetry={() => refetch()} />
      ) : data.length === 0 ? (
        <SectionMessage message="아직 등록한 프로젝트가 없습니다." />
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
