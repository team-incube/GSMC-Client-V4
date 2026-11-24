import type { AwardCompetitionType } from "@repo/lib";

export type MemberDto = {
  id: string;
  name: string;
  email: string;
  grade: number | null;
  classNumber: number | null;
  number: number | null;
};

export type SearchMembersResponse = {
  searchMembers: {
    members: MemberDto[];
    totalPages: number;
  };
};

// 여러 학생의 총점을 한 번에 조회한 응답. 존재하지 않는 학생은 빠진다.
export type TotalScoresResponse = { totalScores: { memberId: string; totalScore: number }[] };

type FileDto = { originalName: string; uri: string };

export type CategoryScoreDto = {
  scoreId: string;
  scoreStatus: "INCOMPLETE" | "PENDING" | "APPROVED" | "REJECTED";
  activityName: string | null;
  scoreValue: number | null;
  activityDate: string | null;
  competitionType: AwardCompetitionType | null;
  submittedCategoryType: string | null;
  file: FileDto | null;
  evidence: { title: string; content: string; files: FileDto[] } | null;
};

export type ScoresByCategoryResponse = {
  scoresByCategory: {
    categoryType: string;
    categoryKoreanName: string;
    recognizedScore: number;
    scores: CategoryScoreDto[];
  }[];
};
