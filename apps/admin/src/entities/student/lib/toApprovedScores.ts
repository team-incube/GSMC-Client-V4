import { AWARD_COMPETITION_TYPE_LABEL, type CertificationCategoryConfig } from "@repo/lib";
import type { ScoresByCategoryResponse } from "../api/types";
import type { StudentApprovedScore } from "../model/types";

type CategoryGroup = ScoresByCategoryResponse["scoresByCategory"][number];

// 서버는 점수형 항목의 원점수를 저장하지 않고 환산 점수만 준다. 봉사활동은 1시간당 1점이라 점수가 곧 시간이다.
// 자격증은 심사 화면과 같이 점수를 따로 보여 주지 않는다.
function toValueLabel(code: CertificationCategoryConfig["code"], scoreValue: number | null) {
  if (scoreValue == null || code === "LICENSE") return undefined;
  return code === "VOLUNTEER" ? `봉사 ${scoreValue}시간` : `인정 ${scoreValue}점`;
}

// 카테고리에 속한 서버 그룹들에서 승인된 점수만 골라 화면용으로 바꾼다.
export function toApprovedScores(config: CertificationCategoryConfig, groups: CategoryGroup[]): StudentApprovedScore[] {
  return groups.flatMap((group) =>
    group.scores
      .filter((score) => score.scoreStatus === "APPROVED")
      .map((score) => ({
        id: score.scoreId,
        title:
          score.activityName ?? score.evidence?.title ?? config.submissionTitle ?? group.categoryKoreanName,
        details: [
          config.code === "LANGUAGE_SCORE" ? (score.submittedCategoryType ?? group.categoryType) : undefined,
          score.competitionType ? AWARD_COMPETITION_TYPE_LABEL[score.competitionType] : undefined,
          score.activityDate ?? undefined,
        ].filter((value): value is string => Boolean(value)),
        valueLabel: toValueLabel(config.code, score.scoreValue),
        content: score.evidence?.content || undefined,
        files: (score.file ? [score.file] : (score.evidence?.files ?? [])).map((file) => ({
          name: file.originalName,
          uri: file.uri,
        })),
      })),
  );
}
