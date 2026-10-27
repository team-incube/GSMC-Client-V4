import { CERTIFICATION_CATEGORIES, TOTAL_MAX_SCORE, sumCategoryScore } from "@repo/lib";
import type { MyScoresResponse, ScoresByCategoryResponse } from "../api/types";
import type { CertificationSubmission, MyCertification } from "../model/types";

type Params = {
  studentName: string;
  totalScore: number;
  scoresByCategory: ScoresByCategoryResponse["myScoresByCategory"];
  scores: MyScoresResponse["myScores"];
};

export function toMyCertification({ studentName, totalScore, scoresByCategory, scores }: Params): MyCertification {
  const scoreById = new Map(scores.map((score) => [score.scoreId, score]));

  const categories = CERTIFICATION_CATEGORIES.map((config) => {
    const { code, name, maxScore, apiTypes } = config;
    const matched = scoresByCategory.filter((category) => apiTypes.includes(category.categoryType));

    const submissions = matched.flatMap((category) =>
      category.scores.map((score): CertificationSubmission => {
        const detail = scoreById.get(score.scoreId);
        return {
          id: score.scoreId,
          title: score.activityName ?? category.categoryKoreanName,
          submittedAt: detail?.updatedAt?.slice(0, 10),
          status: score.scoreStatus,
          score: detail?.scoreValue ?? undefined,
        };
      }),
    );

    return { code, name, maxScore, score: sumCategoryScore(config, matched), submissions };
  });

  return {
    studentName,
    totalScore: Math.min(totalScore, TOTAL_MAX_SCORE),
    maxScore: TOTAL_MAX_SCORE,
    categories,
  };
}
