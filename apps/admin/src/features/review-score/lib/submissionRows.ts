import { AWARD_COMPETITION_TYPE_LABEL, type CertificationCategoryCode } from "@repo/lib";
import type { PendingScore } from "@/entities/score";

type Row = { label: string; value: string };

const ACTIVITY_LABEL: Partial<Record<CertificationCategoryCode, string>> = {
  LICENSE: "자격증명",
  AWARD: "대회명 및 수상내역",
  EXTERNAL_ACTIVITY: "대회 및 외부활동명",
  READING: "도서명",
};

const DATE_LABEL: Partial<Record<CertificationCategoryCode, string>> = {
  LICENSE: "취득일",
  AWARD: "수상일",
};

// 서버는 점수형 항목의 원점수(예: TOPCIT 698점)를 저장하지 않고 환산 점수만 준다. 그래서 인정 점수로 보여 준다.
// 봉사활동은 1시간당 1점이라 점수가 곧 봉사 시간이다.
export function toSubmissionRows(score: PendingScore): Row[] {
  const code = score.categoryCode;
  const rows: (Row | false)[] = [
    code === "LANGUAGE_SCORE" && { label: "시험 종류", value: score.examType },
    !!score.competitionType && { label: "수상 종류", value: AWARD_COMPETITION_TYPE_LABEL[score.competitionType] },
    !!score.activityName && { label: (code && ACTIVITY_LABEL[code]) ?? "활동명", value: score.activityName },
    !!score.activityDate && { label: (code && DATE_LABEL[code]) ?? "활동일", value: score.activityDate },
    score.scoreValue != null &&
      (code === "VOLUNTEER"
        ? { label: "봉사 시간", value: `${score.scoreValue}시간` }
        : { label: "인정 점수", value: `${score.scoreValue}점` }),
  ];
  return rows.filter((row): row is Row => Boolean(row));
}

// 표의 "제출 내용" 칸에 보여 줄 한 줄 요약
export function toSubmissionSummary(score: PendingScore) {
  if (score.activityName) return score.activityName;
  if (score.evidence?.title) return score.evidence.title;
  if (score.scoreValue != null) return `${score.categoryName} ${score.scoreValue}점`;
  return score.categoryName;
}
