import { CERTIFICATION_CATEGORIES } from "@repo/lib";
import type { PendingScoreGroupDto } from "../api/types";
import type { PendingScore, ScoreStudent } from "../model/types";

export function toPendingScores(
  groups: (readonly [string, PendingScoreGroupDto[]])[],
  students: ScoreStudent[],
): PendingScore[] {
  const studentById = new Map(students.map((student) => [student.id, student]));

  return groups
    .flatMap(([memberId, categories]) => {
      const student = studentById.get(memberId);
      if (!student) return [];
      return categories.flatMap((category) => {
        const config = CERTIFICATION_CATEGORIES.find((item) => item.apiTypes.includes(category.categoryType));
        return category.scores.map(
          (score): PendingScore => ({
            scoreId: score.scoreId,
            student,
            categoryCode: config?.code ?? null,
            categoryName: config?.name ?? category.categoryKoreanName,
            examType: score.submittedCategoryType ?? category.categoryType,
            activityName: score.activityName,
            scoreValue: score.scoreValue,
            activityDate: score.activityDate,
            competitionType: score.competitionType,
            submittedAt: score.updatedAt.slice(0, 10),
            files: score.file ? [score.file] : (score.evidence?.files ?? []),
            evidence: score.evidence && { title: score.evidence.title, content: score.evidence.content },
          }),
        );
      });
    })
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}
