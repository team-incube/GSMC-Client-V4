import type { SubmissionStatus } from "./types";

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  INCOMPLETE: "미완료",
  PENDING: "검토 중",
  APPROVED: "승인",
  REJECTED: "반려",
};
