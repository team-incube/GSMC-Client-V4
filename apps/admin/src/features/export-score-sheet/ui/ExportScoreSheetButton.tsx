"use client";

import { useMutation } from "@tanstack/react-query";
import type { SVGProps } from "react";
import { toast } from "sonner";
import { fetchScoreSheetUrl } from "../api/scoreSheet";

type ExportScoreSheetButtonProps = {
  grade: number | null;
  classNumber: number | null;
};

export function ExportScoreSheetButton({ grade, classNumber }: ExportScoreSheetButtonProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ grade, classNumber }: { grade: number; classNumber: number | null }) =>
      fetchScoreSheetUrl(grade, classNumber),
    onSuccess: (url) => window.location.assign(url),
    onError: () => toast.error("엑셀 파일을 만들지 못했어요. 잠시 후 다시 시도해 주세요."),
  });

  const handleClick = () => {
    if (grade == null) {
      toast.info("필터에서 내보낼 학년을 먼저 선택해 주세요.");
      return;
    }
    mutate({ grade, classNumber });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-brand px-4 text-[13px] leading-[19.5px] font-medium text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
    >
      <FileDownloadIcon className="size-3.5" />
      {isPending ? "내보내는 중..." : "엑셀 내보내기"}
    </button>
  );
}

function FileDownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M8.75 1.16667H3.5C3.19058 1.16667 2.89383 1.28958 2.67504 1.50838C2.45625 1.72717 2.33333 2.02391 2.33333 2.33333V11.6667C2.33333 11.9761 2.45625 12.2728 2.67504 12.4916C2.89383 12.7104 3.19058 12.8333 3.5 12.8333H10.5C10.8094 12.8333 11.1062 12.7104 11.325 12.4916C11.5437 12.2728 11.6667 11.9761 11.6667 11.6667V4.08333L8.75 1.16667Z" />
      <path d="M8.16667 1.16667V3.5C8.16667 3.80942 8.28958 4.10617 8.50838 4.32496C8.72717 4.54375 9.02391 4.66667 9.33333 4.66667H11.6667" />
      <path d="M7 10.5V7" />
      <path d="M5.25 8.75L7 10.5L8.75 8.75" />
    </svg>
  );
}
