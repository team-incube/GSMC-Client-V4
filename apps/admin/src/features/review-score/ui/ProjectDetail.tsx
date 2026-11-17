"use client";

import { useId, useState } from "react";
import { formatStudentNumber } from "@repo/lib";
import { Button, ChevronDownIcon, ProjectLogo } from "@repo/ui";
import { isNotFoundError, useDataGsmProjectQuery, type DataGsmProject } from "@/entities/project";

type ProjectDetailProps = {
  dgProjectId: string;
  // 상세를 받기 전에도 보여 줄 학생이 입력한 프로젝트 이름
  title: string;
};

const STATUS_LABEL: Record<DataGsmProject["status"], string> = {
  ACTIVE: "진행 중",
  ENDED: "종료",
};

const formatPeriod = ({ startYear, endYear }: DataGsmProject) => {
  if (startYear == null && endYear == null) return null;
  if (startYear === endYear) return `${startYear}년`;
  if (startYear == null) return `~ ${endYear}년`;
  return endYear == null ? `${startYear}년 ~` : `${startYear}년 ~ ${endYear}년`;
};

// 프로젝트 이름을 누르면 DataGSM 프로젝트 상세(로고, 설명, 기간, 동아리, 참여자)를 펼친다.
export function ProjectDetail({ dgProjectId, title }: ProjectDetailProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const query = useDataGsmProjectQuery(dgProjectId, open);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-wash">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-surface focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none focus-visible:ring-inset"
      >
        <span className="min-w-0 truncate text-[13px] leading-[19.5px] font-medium text-strong">{title}</span>
        <span className="flex shrink-0 items-center gap-1 text-[11px] leading-[16.5px] text-soft">
          {open ? "접기" : "상세 보기"}
          <ChevronDownIcon
            aria-hidden="true"
            className={`size-[11px] transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open && (
        <div id={panelId} className="border-t border-line bg-surface px-4 py-4">
          {query.isPending ? (
            <ProjectDetailSkeleton />
          ) : query.isError ? (
            <div className="flex flex-col items-center gap-3 py-2">
              <p role="alert" className="text-[13px] leading-[19.5px] text-soft">
                {isNotFoundError(query.error)
                  ? "DataGSM에서 프로젝트를 찾을 수 없어요."
                  : "프로젝트 정보를 불러오지 못했어요."}
              </p>
              {!isNotFoundError(query.error) && (
                <Button variant="secondary" size="md" onClick={() => query.refetch()} disabled={query.isFetching}>
                  다시 시도
                </Button>
              )}
            </div>
          ) : (
            <ProjectDetailBody project={query.data} />
          )}
        </div>
      )}
    </div>
  );
}

function ProjectDetailBody({ project }: { project: DataGsmProject }) {
  const period = formatPeriod(project);
  const info = [
    { label: "상태", value: STATUS_LABEL[project.status] },
    { label: "기간", value: period },
    { label: "동아리", value: project.clubName },
  ].filter((item): item is { label: string; value: string } => item.value != null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-wash">
          <ProjectLogo name={project.name} logoUrl={project.logoUrl} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-[21px] font-semibold break-words text-strong">{project.name}</p>
          <p className="pt-1 text-[13px] leading-[20px] break-words whitespace-pre-line text-body">
            {project.description || <span className="text-faint">등록된 설명이 없어요.</span>}
          </p>
        </div>
      </div>

      {info.length > 0 && (
        <dl className="flex flex-col">
          {info.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 border-b border-linesoft py-1.5 last:border-b-0"
            >
              <dt className="shrink-0 text-[11px] leading-[16.5px] tracking-[0.08em] text-faint">{item.label}</dt>
              <dd className="text-right text-[13px] leading-[19.5px] break-keep text-body">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div>
        <p className="pb-2 text-[11px] leading-[16.5px] font-medium tracking-[0.08em] text-soft">
          참여자 · {project.participants.length}명
        </p>
        {project.participants.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {project.participants.map(({ id, name, studentNumber }) => (
              <li
                key={id}
                className="rounded-full border border-line bg-wash px-2.5 py-0.5 text-[12px] leading-[18px] text-body"
              >
                {name}
                {studentNumber && <span className="pl-1 text-faint">{formatStudentNumber(studentNumber)}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] leading-[18px] text-faint">등록된 참여자가 없어요.</p>
        )}
      </div>
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="size-14 animate-pulse rounded-md bg-wash" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <div className="h-4 w-1/2 animate-pulse rounded bg-wash" />
          <div className="h-3 w-full animate-pulse rounded bg-wash" />
        </div>
      </div>
      <div className="h-16 animate-pulse rounded bg-wash" />
    </div>
  );
}
