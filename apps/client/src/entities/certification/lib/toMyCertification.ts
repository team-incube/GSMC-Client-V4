import type { MyScoresResponse, ScoresByCategoryResponse } from "../api/types";
import { CATEGORY_CONFIGS, TOTAL_MAX_SCORE } from "../model/categories";
import type { CertificationSubmission, MyCertification } from "../model/types";

type Params = {
  studentName: string;
  totalScore: number;
  scoresByCategory: ScoresByCategoryResponse["myScoresByCategory"];
  scores: MyScoresResponse["myScores"];
};

export function toMyCertification({ studentName, totalScore, scoresByCategory, scores }: Params): MyCertification {
  const scoreById = new Map(scores.map((score) => [score.scoreId, score]));

  const categories = CATEGORY_CONFIGS.map(({ code, name, maxScore, apiTypes }) => {
    const matched = scoresByCategory.filter((category) => apiTypes.includes(category.categoryType));
    const recognized = matched.reduce((sum, category) => sum + category.recognizedScore, 0);

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

    return { code, name, maxScore, score: Math.min(recognized, maxScore), submissions };
  });

  return {
    studentName,
    totalScore: Math.min(totalScore, TOTAL_MAX_SCORE),
    maxScore: TOTAL_MAX_SCORE,
    categories,
  };
}
