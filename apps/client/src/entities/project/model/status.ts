import type { ProjectStatus } from "./types";

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  DRAFT: "미작성",
  INCOMPLETE: "미완료",
  PENDING: "심사중",
  APPROVED: "승인",
  REJECTED: "반려",
};

// 제출 내역(SubmissionList)의 상태 색과 맞춘다.
export const PROJECT_STATUS_TEXT_CLASS: Record<ProjectStatus, string> = {
  DRAFT: "text-faint",
  INCOMPLETE: "text-faint",
  PENDING: "text-caution",
  APPROVED: "text-brand",
  REJECTED: "text-danger",
};
