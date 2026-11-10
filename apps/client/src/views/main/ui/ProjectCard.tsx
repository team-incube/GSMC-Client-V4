import Link from "next/link";
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_TEXT_CLASS, ProjectLogo, type Project } from "@/entities/project";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { id, title, description, status } = project;

  return (
    <li>
      <Link
        href={`/projects/${id}`}
        className="group block overflow-hidden rounded-lg border border-line transition-colors duration-200 hover:border-brand focus-visible:border-brand"
      >
        <div className="flex aspect-video items-center justify-center bg-wash">
          <ProjectLogo project={project} />
        </div>
        <div className="p-2.5">
          <p className="truncate pb-1 text-[14px] leading-4.5 font-medium tracking-[-0.28px] text-strong transition-colors duration-200 group-hover:text-brand group-focus-visible:text-brand">
            {title}
          </p>
          {description && <p className="line-clamp-2 pb-1 text-[12px] leading-4 break-words text-soft">{description}</p>}
          <p className={`pt-1 text-[12px] leading-4 ${PROJECT_STATUS_TEXT_CLASS[status]}`}>{PROJECT_STATUS_LABEL[status]}</p>
        </div>
      </Link>
    </li>
  );
}
