"use client";

import { useState } from "react";
import { FileTextIcon } from "@repo/ui";
import type { Project } from "../model/types";

type ProjectLogoProps = {
  project: Pick<Project, "title" | "logoUrl">;
  // 로고 이미지에만 적용한다. 바깥 크기와 테두리는 호출하는 쪽에서 정한다.
  className?: string;
};

// 로고가 없거나 불러오지 못하면 문서 아이콘을 가운데에 둔다.
export function ProjectLogo({ project, className }: ProjectLogoProps) {
  const { title, logoUrl } = project;
  // 실패한 주소를 기억해, 로고 주소가 바뀌면 다시 시도한다.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!logoUrl || failedUrl === logoUrl) {
    return <FileTextIcon aria-hidden="true" className="size-4.5 text-faint" />;
  }

  // 로고는 외부 URL이라 next/image 도메인 설정 없이 그대로 보여 준다.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={`${title} 로고`}
      onError={() => setFailedUrl(logoUrl)}
      className={`size-full object-cover ${className ?? ""}`}
    />
  );
}
