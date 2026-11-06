import type { AwardCompetitionType } from "@repo/lib";

export type FileDto = { originalName: string; uri: string };

export type PendingScoreDto = {
  scoreId: string;
  activityName: string | null;
  scoreValue: number | null;
  updatedAt: string;
  activityDate: string | null;
  competitionType: AwardCompetitionType | null;
  submittedCategoryType: string | null;
  file: FileDto | null;
  evidence: { title: string; content: string; files: FileDto[] } | null;
};

export type PendingScoreGroupDto = {
  categoryType: string;
  categoryKoreanName: string;
  scores: PendingScoreDto[];
};

// 별칭(s0, s1, ...)으로 여러 학생의 대기 점수를 한 번에 조회한 응답
export type PendingScoresResponse = Record<string, PendingScoreGroupDto[] | null>;
