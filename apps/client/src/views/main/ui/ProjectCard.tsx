import Link from "next/link";
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_TEXT_CLASS, ProjectLogo, type Project } from "@/entities/project";

// 카드에는 소개를 이 글자 수까지만 보여 준다. 전체 소개는 상세 페이지에서 본다.
const DESCRIPTION_MAX_LENGTH = 40;

function shortenDescription(description: string) {
  const characters = Array.from(description.replace(/\s+/g, " ").trim());
  if (characters.length <= DESCRIPTION_MAX_LENGTH) return characters.join("");
  return `${characters.slice(0, DESCRIPTION_MAX_LENGTH).join("").trimEnd()}…`;
}

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
          {/* 모든 카드 높이를 맞추려고 소개가 없어도 3줄 높이를 비워 둔다. 좁은 화면에서 넘치면 3줄에서 끊는다. */}
          <p className="line-clamp-3 h-12 text-[12px] leading-4 break-words text-soft">
            {description ? shortenDescription(description) : null}
          </p>
          <p className={`pt-1 text-[12px] leading-4 ${PROJECT_STATUS_TEXT_CLASS[status]}`}>{PROJECT_STATUS_LABEL[status]}</p>
        </div>
      </Link>
    </li>
  );
}
