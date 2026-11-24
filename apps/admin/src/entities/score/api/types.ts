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
  dgProjectId: string | null;
  file: FileDto | null;
  evidence: { title: string; content: string; files: FileDto[] } | null;
};

export type PendingScoreItemDto = {
  categoryType: string;
  categoryKoreanName: string;
  member: { id: string; name: string; grade: number | null; classNumber: number | null; number: number | null };
  score: PendingScoreDto;
};

export type PendingScoreFilter = { grade: number | null; classNumber: number | null };

export type PendingScoresResponse = {
  pendingScores: { items: PendingScoreItemDto[]; totalPages: number };
};
