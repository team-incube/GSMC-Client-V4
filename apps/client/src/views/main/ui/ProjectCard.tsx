import { PROJECT_STATUS_LABEL, PROJECT_STATUS_TEXT_CLASS, ProjectLogo, type Project } from "@/entities/project";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, status } = project;

  // TODO: DataGSM 프로젝트 ID는 내부 프로젝트 상세(/projects/[id])의 ID와 달라서, 이동 경로가 정해지면 링크를 단다.
  return (
    <li className="overflow-hidden rounded-lg border border-line">
      <div className="flex aspect-video items-center justify-center bg-wash">
        <ProjectLogo project={project} />
      </div>
      <div className="p-2.5">
        <p className="truncate pb-1 text-[14px] leading-4.5 font-medium tracking-[-0.28px] text-strong">{title}</p>
        {description && <p className="line-clamp-2 pb-1 text-[12px] leading-4 break-words text-soft">{description}</p>}
        <p className={`pt-1 text-[12px] leading-4 ${PROJECT_STATUS_TEXT_CLASS[status]}`}>{PROJECT_STATUS_LABEL[status]}</p>
      </div>
    </li>
  );
}
