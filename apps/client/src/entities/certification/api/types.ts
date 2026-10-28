import type { SubmissionStatus } from "../model/types";

export type ScoresByCategoryResponse = {
  myScoresByCategory: {
    categoryType: string;
    categoryEnglishName: string;
    categoryKoreanName: string;
    recognizedScore: number;
    scores: { scoreId: string; activityName: string | null; scoreStatus: SubmissionStatus }[];
  }[];
};

export type MyScoresResponse = {
  myScores: {
    scoreId: string;
    scoreStatus: SubmissionStatus;
    activityName: string | null;
    scoreValue: number | null;
    updatedAt: string | null;
  }[];
};

export type MyTotalScoreResponse = {
  myTotalScore: { totalScore: number };
};

export type MyMemberResponse = {
  myMember: { name: string; grade: number | null };
};

// 서버 CategoryType 중 파일과 함께 점수를 신청하는 카테고리
export type ScoreCategoryType = "AWARD" | "EXTERNAL_ACTIVITY" | "NEWRROW_SCHOOL";

export type AddScoreWithFileResponse = {
  addScoreWithFile: { scoreId: string };
};
