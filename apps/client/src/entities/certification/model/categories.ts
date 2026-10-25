import type { CertificationCategoryCode } from "./types";

type CategoryConfig = {
  code: CertificationCategoryCode;
  name: string;
  maxScore: number;
  // 이 화면 항목에 합산할 서버 CategoryType 목록
  apiTypes: string[];
};

export const TOTAL_MAX_SCORE = 100;

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  { code: "READING", name: "독서활동", maxScore: 7, apiTypes: ["READ_A_THON"] },
  { code: "VOLUNTEER", name: "봉사활동", maxScore: 10, apiTypes: ["VOLUNTEER"] },
  { code: "JOB_SKILL", name: "직업기초능력평가", maxScore: 5, apiTypes: ["NCS"] },
  { code: "LICENSE", name: "자격증", maxScore: 14, apiTypes: ["CERTIFICATE"] },
  { code: "TOPCIT", name: "TOPCIT", maxScore: 10, apiTypes: ["TOPCIT"] },
  { code: "LANGUAGE_SCORE", name: "공인점수", maxScore: 10, apiTypes: ["TOEIC", "JLPT", "TOEIC_ACADEMY"] },
  { code: "AWARD", name: "수상경력", maxScore: 10, apiTypes: ["AWARD"] },
  { code: "NEWROW_SCHOOL", name: "뉴로우스쿨", maxScore: 5, apiTypes: ["NEWRROW_SCHOOL"] },
  { code: "GRADE", name: "교과성적", maxScore: 9, apiTypes: ["ACADEMIC_GRADE"] },
  { code: "PROJECT", name: "프로젝트 참여", maxScore: 10, apiTypes: ["PROJECT_PARTICIPATION"] },
  { code: "EXTERNAL_ACTIVITY", name: "외부활동", maxScore: 10, apiTypes: ["EXTERNAL_ACTIVITY"] },
];
