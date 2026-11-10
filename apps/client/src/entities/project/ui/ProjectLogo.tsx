import { FileTextIcon } from "@repo/ui";
import type { Project } from "../model/types";

type ProjectLogoProps = {
  project: Pick<Project, "title" | "logoUrl">;
  className?: string;
};

// 로고가 없으면 문서 아이콘을 가운데에 둔다. 바깥 크기와 테두리는 호출하는 쪽에서 정한다.
export function ProjectLogo({ project, className }: ProjectLogoProps) {
  const { title, logoUrl } = project;

  if (!logoUrl) {
    return <FileTextIcon aria-hidden="true" className="size-4.5 text-faint" />;
  }

  // 로고는 외부 URL이라 next/image 도메인 설정 없이 그대로 보여 준다.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={logoUrl} alt={`${title} 로고`} className={`size-full object-cover ${className ?? ""}`} />;
}
