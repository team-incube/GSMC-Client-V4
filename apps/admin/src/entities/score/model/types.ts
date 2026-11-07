import type { AwardCompetitionType, CertificationCategoryCode } from "@repo/lib";
import type { FileDto } from "../api/types";

export type ScoreStudent = {
  id: string;
  name: string;
  grade: number | null;
  classNumber: number | null;
  number: number | null;
};

export type PendingScore = {
  scoreId: string;
  student: ScoreStudent;
  // 화면 항목 코드. 서버 CategoryType이 화면 항목에 없으면 null.
  categoryCode: CertificationCategoryCode | null;
  categoryName: string;
  // 공인점수처럼 여러 시험을 묶는 항목에서 실제 제출한 시험 (TOEIC, JLPT, ...)
  examType: string;
  activityName: string | null;
  scoreValue: number | null;
  activityDate: string | null;
  competitionType: AwardCompetitionType | null;
  // 서버가 생성 시각을 내려주지 않아 최근 수정 시각을 제출일로 쓴다.
  submittedAt: string;
  files: FileDto[];
  evidence: { title: string; content: string } | null;
};
