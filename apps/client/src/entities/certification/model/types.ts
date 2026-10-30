import type { CertificationCategoryCode } from "@repo/lib";

export type { CertificationCategoryCode };

export type SubmissionStatus = "INCOMPLETE" | "PENDING" | "APPROVED" | "REJECTED";

// 수상경력의 대회 종류. 심사 참고용이며 점수 계산에는 영향을 주지 않는다.
export type AwardCompetitionType =
  | "OFFICIAL_MAJOR_COMPETITION"
  | "INDIVIDUAL_MAJOR_COMPETITION"
  | "UNION_HACKATHON"
  | "GSM_FESTIVAL"
  | "SCHOOL_HACKATHON"
  | "MAJOR_CLUB_PRESENTATION"
  | "CHARACTER_RELATED";

export type CertificationSubmission = {
  id: string;
  categoryType: string;
  title: string;
  // 대회 종류·활동 날짜처럼 제목 아래에 함께 보여 줄 부가 정보
  details: string[];
  fileName?: string;
  // 제출한 날짜(YYYY-MM-DD). 서버에 생성 시각이 없어 마지막으로 수정된 날짜를 쓴다.
  submittedAt?: string;
  // 실제 활동 날짜(YYYY-MM-DD)
  activityDate?: string;
  competitionType?: AwardCompetitionType;
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
