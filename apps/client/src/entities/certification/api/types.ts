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
  myMember: { name: string };
};
