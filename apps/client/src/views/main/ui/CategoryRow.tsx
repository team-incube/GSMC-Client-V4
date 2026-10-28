import Link from "next/link";
import { useId, useState } from "react";
import { Button, ChevronDownIcon, buttonClassName } from "@repo/ui";
import type { CertificationCategory, CertificationSubmission } from "@/entities/certification";
import { ScoreEditModal, ScoreSubmitModal, canEditSubmission, canSubmitScore } from "@/features/submit-score";
import { ProgressBar } from "./ProgressBar";
import { SubmissionList } from "./SubmissionList";

type CategoryRowProps = {
  category: CertificationCategory;
};

export function CategoryRow({ category }: CategoryRowProps) {
  const { code, name, score, maxScore, submissions } = category;
  const [open, setOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [editing, setEditing] = useState<CertificationSubmission | null>(null);
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
          <Link href="/projects" className={buttonClassName({ size: "sm" })}>
            바로가기
          </Link>
        ) : canSubmitScore(code) ? (
          <Button size="sm" aria-label={`${name} 제출하기`} onClick={() => setSubmitOpen(true)}>
            제출하기
          </Button>
        ) : (
          // TODO: 나머지 카테고리의 제출 모달이 생기면 연결한다.
          <Button size="sm" aria-label={`${name} 제출하기`}>
            제출하기
          </Button>
        )}
      </div>
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <SubmissionList
            submissions={submissions}
            canEdit={canEditSubmission}
            onEdit={canSubmitScore(code) ? setEditing : undefined}
          />
        </div>
      </div>
      {canSubmitScore(code) && (
        <>
          <ScoreSubmitModal category={category} open={submitOpen} onOpenChange={setSubmitOpen} />
          <ScoreEditModal category={category} submission={editing} onClose={() => setEditing(null)} />
        </>
      )}
    </li>
  );
}
