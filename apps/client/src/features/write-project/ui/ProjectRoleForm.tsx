"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, buttonClassName } from "@repo/ui";
import { useSubmitProjectMutation } from "../model/submitProject";

type ProjectRoleFormProps = {
  projectId: string;
};

const ROLE_PLACEHOLDER =
  "예) 프론트엔드 개발 담당. React와 Tailwind를 사용해 메인 페이지와 사용자 인증 UI를 구현했습니다. 또한 API 연동 작업을 맡아 백엔드 팀과 협업했습니다.";

export function ProjectRoleForm({ projectId }: ProjectRoleFormProps) {
  const [role, setRole] = useState("");
  const { mutate, isPending } = useSubmitProjectMutation();
  const submittingRef = useRef(false);
  const fieldId = useId();
  const hintId = useId();

  const content = role.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content || submittingRef.current) return;
    submittingRef.current = true;
    mutate(
      { projectId, content },
      {
        onSettled: () => {
          submittingRef.current = false;
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} aria-busy={isPending} className="flex flex-col gap-8">
      <div className="group flex flex-col gap-2">
        <label
          htmlFor={fieldId}
          className="text-[11px] leading-[16.5px] font-medium tracking-[0.08em] text-soft transition-colors duration-200 group-focus-within:text-brand"
        >
          내 역할
        </label>
        <p id={hintId} className="text-[14px] leading-[21px] text-body">
          이 프로젝트에서 맡은 역할과 직접 구현한 기능을 구체적으로 작성하세요.
        </p>
        <textarea
          id={fieldId}
          value={role}
          onChange={(event) => setRole(event.target.value)}
          placeholder={ROLE_PLACEHOLDER}
          aria-describedby={hintId}
          readOnly={isPending}
          rows={8}
          className="mt-2 min-h-48 w-full resize-y rounded-xl border border-line bg-surface px-4 py-3.5 text-base leading-[26px] text-body outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-faint read-only:opacity-50 focus:border-brand focus:shadow-[inset_0_0_0_1px_var(--brand)] md:text-[14px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/projects/${projectId}`}
          aria-disabled={isPending}
          tabIndex={isPending ? -1 : undefined}
          className={buttonClassName({
            variant: "secondary",
            size: "lg",
            className: "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          })}
        >
          취소
        </Link>
        <Button
          type="submit"
          size="lg"
          disabled={!content}
          aria-disabled={isPending}
          className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          {isPending ? "제출 중…" : "제출하기"}
        </Button>
      </div>
    </form>
  );
}
