export const AWARD_TYPES = [
  "공문을 통한 전공분야 대회",
  "전공 분야 대회 개별 참여",
  "연합 해커톤",
  "GSM Festival",
  "교내해커톤",
  "전공동아리 발표대회",
  "교내외 인성관련",
] as const;

export type AwardType = (typeof AWARD_TYPES)[number];

// 회고온도 20점마다 1점씩 오른다.
export const NEWRROW_SCORE_STEP = 20;
export const NEWRROW_MAX_TEMPERATURE = 100;

export const SUBMIT_ERROR_MESSAGE = "제출하지 못했습니다. 잠시 후 다시 시도해 주세요.";

export const EDIT_ERROR_MESSAGE = "수정하지 못했습니다. 이미 심사가 끝났다면 수정할 수 없습니다.";
