import type { ProjectStatus } from "./types";

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  DRAFT: "미작성",
  INCOMPLETE: "미완료",
  PENDING: "심사중",
  APPROVED: "승인",
  REJECTED: "반려",
};
