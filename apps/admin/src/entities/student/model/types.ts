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
  totalScore: number;
};

export type StudentCategoryScore = {
  code: CertificationCategoryCode;
  name: string;
  score: number;
  maxScore: number;
};
