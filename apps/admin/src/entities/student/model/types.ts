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

export type StudentCategoryScore = {
  code: CertificationCategoryCode;
  name: string;
  score: number;
  maxScore: number;
};
