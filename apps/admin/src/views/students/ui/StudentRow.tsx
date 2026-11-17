"use client";

import { ChevronDownIcon } from "@repo/ui";
import { useState } from "react";
import type { Student } from "@/entities/student";
import { CategoryScorePanel } from "./CategoryScorePanel";

type StudentRowProps = {
  student: Student;
  columnCount: number;
};

const formatClassInfo = ({ grade, classNumber, number }: Student) =>
  grade == null || classNumber == null || number == null ? "-" : `${grade}학년 ${classNumber}반 ${number}번`;

export function StudentRow({ student, columnCount }: StudentRowProps) {
  const [open, setOpen] = useState(false);
  // 한 번 펼친 뒤에는 패널을 유지해야 접힐 때도 애니메이션이 보인다.
  const [hasOpened, setHasOpened] = useState(false);
  const panelId = `student-scores-${student.id}`;

  const toggle = () => {
    setOpen((prev) => !prev);
    setHasOpened(true);
  };

  return (
    <>
      <tr className="border-b border-line text-[13px] leading-[19.5px]">
        <td className="h-[52px] px-4 py-2 sm:px-5">
          <span className="block truncate font-medium text-strong">{student.name}</span>
          <span className="block truncate text-[11px] leading-[16.5px] text-soft sm:hidden">
            {formatClassInfo(student)}
          </span>
        </td>
        <td className="hidden px-5 tracking-[0.08em] text-body sm:table-cell">{formatClassInfo(student)}</td>
        <td className="hidden truncate px-5 text-soft md:table-cell">{student.email}</td>
        <td className="px-4 text-right font-semibold whitespace-nowrap text-strong sm:px-5">
          {student.totalScore == null ? <span aria-label="점수 없음" className="text-soft">–</span> : `${student.totalScore}점`}
        </td>
        <td className="px-4 text-center sm:px-5">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${student.name} 점수 상세 ${open ? "접기" : "보기"}`}
            className="inline-flex h-7 items-center gap-1 rounded-[5px] border border-line bg-surface px-[11px] text-[11px] leading-[16.5px] font-medium text-soft transition-colors duration-200 hover:bg-wash focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            <ChevronDownIcon
              className={`size-[11px] transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
            />
            {open ? "접기" : "보기"}
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan={columnCount} className="p-0">
          <div
            id={panelId}
            inert={!open}
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              {hasOpened && <CategoryScorePanel memberId={student.id} studentName={student.name} enabled={open} />}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
