import { CERTIFICATION_CATEGORIES, sumCategoryScore } from "@repo/lib";
import type { MyScoresResponse, ScoresByCategoryResponse } from "../api/types";
import { AWARD_COMPETITION_TYPES, AWARD_COMPETITION_TYPE_LABEL } from "../model/competitionType";
import { parseActivityName } from "./activityName";
import type { AwardCompetitionType, CertificationSubmission, MyCertification } from "../model/types";

type Activity = {
  title: string;
  date?: string;
  competitionType?: AwardCompetitionType;
};

// 서버 필드(activityDate, competitionType)가 있으면 그대로 쓰고,
// 필드가 생기기 전에 제출한 건은 활동명에 합쳐 둔 값을 나눠 읽는다.
function toActivity(activityName: string, detail: MyScoresResponse["myScores"][number] | undefined): Activity {
  if (detail?.activityDate || detail?.competitionType) {
    return {
      title: activityName,
      date: detail.activityDate ?? undefined,
      competitionType: detail.competitionType ?? undefined,
    };
  }
  const legacy = parseActivityName(activityName);
  const competitionType = AWARD_COMPETITION_TYPES.find(
    (type) => AWARD_COMPETITION_TYPE_LABEL[type] === legacy.details[0],
  );
  return { title: legacy.title, date: legacy.date, competitionType };
}

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

  const configs = CERTIFICATION_CATEGORIES.filter((config) => !(config.firstGradeOnly && grade !== null && grade !== 1));
  const totalMaxScore = configs.reduce((sum, config) => sum + config.maxScore, 0);

  const categories = configs.map((config) => {
    const { code, name, maxScore, apiTypes, submissionTitle } = config;
    const matched = scoresByCategory.filter((category) => apiTypes.includes(category.categoryType));

    const submissions = matched.flatMap((category) =>
      category.scores.map((score): CertificationSubmission => {
        const detail = scoreById.get(score.scoreId);
        const activity = toActivity(score.activityName ?? submissionTitle ?? category.categoryKoreanName, detail);
        return {
          id: score.scoreId,
          title: activity.title,
          details: activity.competitionType ? [AWARD_COMPETITION_TYPE_LABEL[activity.competitionType]] : [],
          fileName: detail?.file?.originalName,
          submittedAt: activity.date ?? detail?.updatedAt?.slice(0, 10),
          activityDate: activity.date,
          competitionType: activity.competitionType,
          status: score.scoreStatus,
          score: detail?.scoreValue ?? undefined,
          rejectionReason: detail?.rejectionReason ?? undefined,
        };
      }),
    );

    return { code, name, maxScore, score: sumCategoryScore(config, matched), submissions };
  });

  return {
    studentName,
    totalScore: Math.min(totalScore, totalMaxScore),
    expectedTotalScore: Math.min(expectedTotalScore, totalMaxScore),
    maxScore: totalMaxScore,
    categories,
  };
}
