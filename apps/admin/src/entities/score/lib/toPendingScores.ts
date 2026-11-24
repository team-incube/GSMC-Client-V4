import { CERTIFICATION_CATEGORIES } from "@repo/lib";
import type { PendingScoreItemDto } from "../api/types";
import type { PendingScore } from "../model/types";

export function toPendingScores(items: PendingScoreItemDto[]): PendingScore[] {
  return items.map(({ score, member, categoryType, categoryKoreanName }) => {
    const config = CERTIFICATION_CATEGORIES.find((item) => item.apiTypes.includes(categoryType));
    return {
      scoreId: score.scoreId,
      student: member,
      categoryCode: config?.code ?? null,
      categoryName: config?.name ?? categoryKoreanName,
      examType: score.submittedCategoryType ?? categoryType,
      activityName: score.activityName,
      scoreValue: score.scoreValue,
      activityDate: score.activityDate,
      competitionType: score.competitionType,
      submittedAt: score.updatedAt.slice(0, 10),
      files: score.file ? [score.file] : (score.evidence?.files ?? []),
      dgProjectId: score.dgProjectId,
      evidence: score.evidence && { title: score.evidence.title, content: score.evidence.content },
    };
  });
}
