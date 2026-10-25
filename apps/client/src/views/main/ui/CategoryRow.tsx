import Link from "next/link";
import { useId, useState } from "react";
import { ChevronDownIcon } from "@repo/ui";
import type { CertificationCategory } from "@/entities/certification";
import { ProgressBar } from "./ProgressBar";
import { SubmissionList } from "./SubmissionList";

const ACTION_CLASS =
  "inline-flex h-7 shrink-0 items-center rounded-md bg-brand px-3 text-[11px] leading-[16.5px] font-medium text-white transition-opacity duration-200 hover:opacity-90";

type CategoryRowProps = {
  category: CertificationCategory;
};

export function CategoryRow({ category }: CategoryRowProps) {
  const { code, name, score, maxScore, submissions } = category;
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <li className="border-b border-line last:border-b-0">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-6">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 self-stretch text-left sm:gap-4"
        >
          <ChevronDownIcon
            aria-hidden="true"
            className={`size-3.25 shrink-0 text-faint transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          />
          <span className="w-24 shrink-0 truncate text-[13px] leading-[19.5px] text-strong sm:w-28">{name}</span>
          <ProgressBar value={score} max={maxScore} label={`${name} 점수`} className="min-w-0 flex-1" />
          <span className="w-10 shrink-0 text-right text-[12px] leading-[18px] text-soft">
            {score}/{maxScore}
          </span>
        </button>
        {code === "PROJECT" ? (
          <Link href="/projects" className={ACTION_CLASS}>
            바로가기
          </Link>
        ) : (
          // TODO: 제출 모달(#35)이 생기면 연결한다.
          <button type="button" aria-label={`${name} 제출하기`} className={ACTION_CLASS}>
            제출하기
          </button>
        )}
      </div>
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <SubmissionList submissions={submissions} />
        </div>
      </div>
    </li>
  );
}
