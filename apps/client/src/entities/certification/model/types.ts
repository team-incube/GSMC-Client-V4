export type CertificationCategoryCode =
  | "READING"
  | "VOLUNTEER"
  | "JOB_SKILL"
  | "LICENSE"
  | "TOPCIT"
  | "LANGUAGE_SCORE"
  | "AWARD"
  | "NEWROW_SCHOOL"
  | "GRADE"
  | "PROJECT"
  | "EXTERNAL_ACTIVITY";

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
  // 심사중인 점수까지 승인된다고 가정한 총점
  expectedTotalScore: number;
  maxScore: number;
  categories: CertificationCategory[];
};
