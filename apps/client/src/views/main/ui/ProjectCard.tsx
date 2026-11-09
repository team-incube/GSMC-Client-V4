import { FileTextIcon } from "@repo/ui";
import { PROJECT_STATUS_LABEL, type Project, type ProjectStatus } from "@/entities/project";

// 제출 내역(SubmissionList)의 상태 색과 맞춘다.
const STATUS_CLASS: Record<ProjectStatus, string> = {
  DRAFT: "text-faint",
  INCOMPLETE: "text-faint",
  PENDING: "text-caution",
  APPROVED: "text-brand",
  REJECTED: "text-danger",
};

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, logoUrl, status } = project;

  // TODO: DataGSM 프로젝트 ID는 내부 프로젝트 상세(/projects/[id])의 ID와 달라서, 이동 경로가 정해지면 링크를 단다.
  return (
    <li className="overflow-hidden rounded-lg border border-line">
      <div className="flex aspect-video items-center justify-center bg-wash">
        {logoUrl ? (
          // 로고는 외부 URL이라 next/image 도메인 설정 없이 그대로 보여 준다.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={`${title} 로고`} className="size-full object-cover" />
        ) : (
          <FileTextIcon aria-hidden="true" className="size-4.5 text-faint" />
        )}
      </div>
      <div className="p-2.5">
        <p className="truncate pb-1 text-[14px] leading-4.5 font-medium tracking-[-0.28px] text-strong">{title}</p>
        {status && <p className={`pt-1 text-[12px] leading-4 ${STATUS_CLASS[status]}`}>{PROJECT_STATUS_LABEL[status]}</p>}
      </div>
    </li>
  );
}
