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
  // 대회 종류처럼 활동명에 함께 저장된 부가 정보
  details: string[];
  fileName?: string;
  // 제출할 때 입력한 날짜. 없으면 마지막으로 수정된 날짜
  submittedAt?: string;
  status: SubmissionStatus;
  score?: number;
  rejectionReason?: string;
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
