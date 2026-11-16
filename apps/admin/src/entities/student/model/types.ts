import type { CertificationCategoryCode } from "@repo/lib";

export type StudentFilter = {
  grade: number | null;
  classNumber: number | null;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  grade: number | null;
  classNumber: number | null;
  number: number | null;
  // 점수를 불러오지 못하면 null. 실제 0점과 구분한다.
  totalScore: number | null;
};

// 승인된 점수 한 건. 학생 조회에서 어떤 항목으로 점수를 받았는지 보여 준다.
export type StudentApprovedScore = {
  id: string;
  title: string;
  // 시험 종류·대회 종류·활동일처럼 제목 아래에 함께 보여 줄 정보
  details: string[];
  // "인정 3점", "봉사 5시간"처럼 표시할 점수. 자격증처럼 점수를 따로 보여 주지 않으면 없다.
  valueLabel?: string;
  content?: string;
  files: { name: string; uri: string }[];
};

export type StudentCategoryScore = {
  code: CertificationCategoryCode;
  name: string;
  score: number;
  maxScore: number;
  approvedScores: StudentApprovedScore[];
};
