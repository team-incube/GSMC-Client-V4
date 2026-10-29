import type { AwardCompetitionType } from "./types";

export const AWARD_COMPETITION_TYPE_LABEL: Record<AwardCompetitionType, string> = {
  OFFICIAL_MAJOR_COMPETITION: "공문을 통한 전공분야 대회",
  INDIVIDUAL_MAJOR_COMPETITION: "전공 분야 대회 개별 참여",
  UNION_HACKATHON: "연합 해커톤",
  GSM_FESTIVAL: "GSM Festival",
  SCHOOL_HACKATHON: "교내해커톤",
  MAJOR_CLUB_PRESENTATION: "전공동아리 발표대회",
  CHARACTER_RELATED: "교내외 인성관련",
};

// 선택지에 보여 줄 순서
export const AWARD_COMPETITION_TYPES = Object.keys(AWARD_COMPETITION_TYPE_LABEL) as AwardCompetitionType[];
