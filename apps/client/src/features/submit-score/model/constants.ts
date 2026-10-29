// 회고온도 20점마다 1점씩 오른다.
export const NEWRROW_SCORE_STEP = 20;
export const NEWRROW_MAX_TEMPERATURE = 100;

export const SUBMIT_ERROR_MESSAGE = "제출하지 못했습니다. 잠시 후 다시 시도해 주세요.";

export const EDIT_ERROR_MESSAGE = "수정하지 못했습니다. 이미 심사가 끝났다면 수정할 수 없습니다.";

export const READING_COURSES = ["거북이", "악어", "토끼", "타조", "사자", "호랑이", "월계관"] as const;
export const READING_SCORE_PER_COURSE = 1;

export const NCS_MIN_GRADE = 1;
export const NCS_MAX_GRADE = 5;

export const LANGUAGE_SCORE_STEP = 100;
export const LANGUAGE_MAX_EXAM_SCORE = 990;
export const LANGUAGE_EXAM_TYPES = ["TOEIC", "JPT", "JLPT"] as const;
export type LanguageExamType = (typeof LANGUAGE_EXAM_TYPES)[number];
export const LANGUAGE_EXAM_MAX_SCORES: Record<LanguageExamType, number> = { TOEIC: 990, JPT: 990, JLPT: 180 };
export const TOEIC_ACADEMY_BONUS = 1;
