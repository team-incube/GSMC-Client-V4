"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, Button } from "@repo/ui";
import {
  canWriteProject,
  isForbiddenError,
  PROJECT_STATUS_LABEL,
  useMyProjectQuery,
  type ProjectStatus,
} from "@/entities/project";
import { ProjectRoleForm } from "@/features/write-project";

type ProjectWritePageProps = {
  projectId: string;
};

export function ProjectWritePage({ projectId }: ProjectWritePageProps) {
  const { data: project, isPending, isError, error, refetch } = useMyProjectQuery(projectId);
  const [entryStatus, setEntryStatus] = useState<ProjectStatus | null>(null);
  if (project && entryStatus === null) {
    setEntryStatus(project.status);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="pt-[1.25px] pb-8">
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-1.5 text-[13px] leading-[19.5px] text-soft transition-colors duration-200 hover:text-strong focus-visible:text-strong"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-[13px]" />
          프로젝트로
        </Link>
      </div>
      {isPending ? (
        <ProjectWriteSkeleton />
      ) : isError ? (
        isForbiddenError(error) ? (
          <WriteMessage message="학생 계정만 프로젝트를 작성할 수 있습니다." />
        ) : (
          <WriteMessage message="프로젝트를 불러오지 못했습니다." onRetry={() => refetch()} />
        )
      ) : !project ? (
        <WriteMessage message="참여 중인 프로젝트에서 찾을 수 없습니다." />
      ) : (
        <>
          <header className="border-b border-line pb-10">
            <h1 className="text-[24px] leading-9 font-semibold tracking-[-0.04em] break-words text-strong md:text-[32px] md:leading-12">
              {project.title}
            </h1>
            {project.clubName && <p className="pt-2 text-[15px] leading-[22.5px] text-body">{project.clubName}</p>}
          </header>
          <div className="flex flex-col gap-10 pt-10">
            {project.description && (
              <section className="flex flex-col gap-3">
                <h2 className="text-[11px] leading-[16.5px] font-medium tracking-[0.08em] text-soft">프로젝트 소개</h2>
                <p className="rounded-xl border border-line bg-wash px-5 py-4 text-[14px] leading-[24px] break-words whitespace-pre-line text-body">
                  {project.description}
                </p>
              </section>
            )}
            {canWriteProject(entryStatus ?? project.status) ? (
              <ProjectRoleForm projectId={project.id} />
            ) : (
              <WriteMessage message={`이미 제출한 프로젝트입니다. (${PROJECT_STATUS_LABEL[project.status]})`} />
            )}
          </div>
        </>
      )}
    </main>
  );
}

type WriteMessageProps = {
  message: string;
  onRetry?: () => void;
};

function WriteMessage({ message, onRetry }: WriteMessageProps) {
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

function ProjectWriteSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-10">
      <div className="h-24 animate-pulse rounded-xl bg-wash" />
      <div className="h-24 animate-pulse rounded-xl bg-wash" />
      <div className="h-64 animate-pulse rounded-xl bg-wash" />
    </div>
  );
}
