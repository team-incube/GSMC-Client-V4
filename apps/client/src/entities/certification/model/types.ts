import type { CertificationCategoryCode } from "@repo/lib";

export type { CertificationCategoryCode };

export type SubmissionStatus = "INCOMPLETE" | "PENDING" | "APPROVED" | "REJECTED";

export type CertificationSubmission = {
  id: string;
  title: string;
  // TODO: 점수 조회 API가 파일명을 주면 채운다.
  fileName?: string;
  submittedAt?: string;
  status: SubmissionStatus;
  score?: number;
};

export type CertificationCategory = {
  code: CertificationCategoryCode;
  name: string;
  score: number;
  maxScore: number;
  submissions: CertificationSubmission[];
};

export type MyCertification = {
  studentName: string;
  totalScore: number;
  maxScore: number;
  categories: CertificationCategory[];
};
