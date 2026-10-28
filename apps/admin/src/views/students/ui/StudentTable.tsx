"use client";

import type { ReactNode } from "react";
import type { Student } from "@/entities/student";
import { useColumnCount } from "../lib/useColumnCount";
import { StudentRow } from "./StudentRow";

type StudentTableProps = {
  students: Student[] | undefined;
  // 이전 필터의 결과를 보여 주는 중이면 true. 새 결과로 오인하거나 조작하지 않게 막는다.
  isUpdating: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function StudentTable({ students, isUpdating, isError, onRetry }: StudentTableProps) {
  const columnCount = useColumnCount();

  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-surface">
      <table aria-busy={isUpdating} className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-wash text-[11px] leading-[16.5px] font-medium tracking-[0.08em] text-soft uppercase">
            <th scope="col" className="px-4 py-4 font-medium sm:w-[22%] sm:px-5 md:w-[15%]">
              이름
            </th>
            <th scope="col" className="hidden px-5 py-4 font-medium sm:table-cell md:w-[22%]">
              학년·반·번호
            </th>
            <th scope="col" className="hidden px-5 py-4 font-medium md:table-cell">
              이메일
            </th>
            <th scope="col" className="w-[76px] px-4 py-4 text-right font-medium sm:w-[15%] sm:px-5 md:w-[13%]">
              총점
            </th>
            <th scope="col" className="w-[92px] px-4 py-4 text-center font-medium sm:w-[18%] sm:px-5">
              점수 상세
            </th>
          </tr>
        </thead>
        <tbody
          inert={isUpdating}
          className={`transition-opacity duration-200 motion-reduce:transition-none ${isUpdating ? "opacity-40" : ""}`}
        >
          {students ? (
            students.length > 0 ? (
              students.map((student) => <StudentRow key={student.id} student={student} columnCount={columnCount} />)
            ) : (
              <MessageRow columnCount={columnCount}>조건에 맞는 학생이 없어요.</MessageRow>
            )
          ) : isError ? (
            <MessageRow columnCount={columnCount}>
              학생 목록을 불러오지 못했어요.{" "}
              <button type="button" onClick={onRetry} className="font-medium text-brand hover:underline">
                다시 시도
              </button>
            </MessageRow>
          ) : (
            Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} />)
          )}
        </tbody>
      </table>
    </div>
  );
}

function MessageRow({ columnCount, children }: { columnCount: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={columnCount} className="px-5 py-16 text-center text-[13px] break-keep text-soft">
        {children}
      </td>
    </tr>
  );
}

const SKELETON_CELLS = [
  { width: 40, className: "" },
  { width: 90, className: "hidden sm:table-cell" },
  { width: 110, className: "hidden md:table-cell" },
  { width: 36, className: "text-right" },
  { width: 56, className: "text-center" },
];

function SkeletonRow() {
  return (
    <tr aria-hidden className="border-b border-line last:border-b-0">
      {SKELETON_CELLS.map(({ width, className }, i) => (
        <td key={i} className={`h-[52px] px-4 sm:px-5 ${className}`}>
          <span className="inline-block h-3 max-w-full animate-pulse rounded bg-wash" style={{ width }} />
        </td>
      ))}
    </tr>
  );
}
