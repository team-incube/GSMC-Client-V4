"use client";

import Link from "next/link";
import { ArrowLeftIcon, Button, PencilIcon } from "@repo/ui";
import { isForbiddenError, ProjectLogo, useMyProjectQuery } from "@/entities/project";
import { ParticipantList } from "./ParticipantList";
import { ProjectInfo } from "./ProjectInfo";

type ProjectDetailPageProps = {
  projectId: string;
};

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const { data: project, isPending, isError, error, refetch } = useMyProjectQuery(projectId);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="pt-[1.25px] pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] leading-[19.5px] text-soft transition-colors duration-200 hover:text-strong focus-visible:text-strong"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-[13px]" />
          메인으로
        </Link>
      </div>
      {isPending ? (
        <ProjectDetailSkeleton />
      ) : isError ? (
        isForbiddenError(error) ? (
          <DetailMessage message="학생 계정만 참여 프로젝트를 볼 수 있습니다." />
        ) : (
          <DetailMessage message="프로젝트를 불러오지 못했습니다." onRetry={() => refetch()} />
        )
      ) : !project ? (
        <DetailMessage message="참여 중인 프로젝트에서 찾을 수 없습니다." />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-line bg-wash p-px">
            <ProjectLogo project={project} className="rounded-[11px]" />
          </div>
          <ProjectInfo project={project} />
          <ParticipantList participants={project.participants} />
          {/* TODO: 프로젝트 참여 점수 작성 화면을 만들면 Link로 바꿔 연결한다. 그 전에는 누를 수 없게 막아 둔다. */}
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="secondary"
              size="lg"
              disabled
              aria-describedby="project-write-notice"
              className="w-full"
            >
              <PencilIcon aria-hidden="true" className="size-[13px]" />
              프로젝트 작성
            </Button>
            <p id="project-write-notice" className="text-[12px] leading-[18px] text-faint">
              프로젝트 작성은 준비 중입니다.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

type DetailMessageProps = {
  message: string;
  onRetry?: () => void;
};

function DetailMessage({ message, onRetry }: DetailMessageProps) {
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

function ProjectDetailSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5">
      <div className="aspect-video animate-pulse rounded-xl bg-wash" />
      <div className="h-36 animate-pulse rounded-xl bg-wash" />
      <div className="h-48 animate-pulse rounded-xl bg-wash" />
    </div>
  );
}
