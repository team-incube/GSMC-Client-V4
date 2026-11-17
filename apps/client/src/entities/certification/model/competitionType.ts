import { AWARD_COMPETITION_TYPE_LABEL, type AwardCompetitionType } from "@repo/lib";

export { AWARD_COMPETITION_TYPE_LABEL };

// 선택지에 보여 줄 순서
export const AWARD_COMPETITION_TYPES = Object.keys(AWARD_COMPETITION_TYPE_LABEL) as AwardCompetitionType[];
