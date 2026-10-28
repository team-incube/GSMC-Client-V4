import type { MyScoresResponse, ScoresByCategoryResponse } from "../api/types";
import { CATEGORY_CONFIGS } from "../model/categories";
import type { CertificationSubmission, MyCertification } from "../model/types";

type Params = {
  studentName: string;
  // 학년 정보가 없으면(교사 등) 학년 제한을 두지 않는다. 서버 집계와 같은 기준이다.
  grade: number | null;
  totalScore: number;
  expectedTotalScore: number;
  scoresByCategory: ScoresByCategoryResponse["myScoresByCategory"];
  scores: MyScoresResponse["myScores"];
};

export function toMyCertification({
  studentName,
  grade,
  totalScore,
  expectedTotalScore,
  scoresByCategory,
  scores,
}: Params): MyCertification {
  const scoreById = new Map(scores.map((score) => [score.scoreId, score]));

  const configs = CATEGORY_CONFIGS.filter((config) => !(config.firstGradeOnly && grade !== null && grade !== 1));
  const totalMaxScore = configs.reduce((sum, config) => sum + config.maxScore, 0);

  const categories = configs.map(({ code, name, maxScore, apiTypes }) => {
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
    totalScore: Math.min(totalScore, totalMaxScore),
    expectedTotalScore: Math.min(expectedTotalScore, totalMaxScore),
    maxScore: totalMaxScore,
    categories,
  };
}
