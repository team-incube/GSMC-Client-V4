import { NCS_MAX_GRADE, NCS_MIN_GRADE, NEWRROW_MAX_TEMPERATURE, NEWRROW_SCORE_STEP } from "../model/constants";

export type DateParts = {
  year: string;
  month: string;
  day: string;
};

export const EMPTY_DATE: DateParts = { year: "", month: "", day: "" };

export function isDateFilled({ year, month, day }: DateParts) {
  return year.length === 4 && month.length > 0 && day.length > 0;
}

// 실제로 있는 날짜면 YYYY-MM-DD를, 아니면 null을 돌려준다.
export function toIsoDate({ year, month, day }: DateParts) {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const date = new Date(y, m - 1, d);
  if (year.length !== 4 || date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  return `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// 오늘 날짜(YYYY-MM-DD). 기기 시간대 기준이다.
export function todayIsoDate() {
  const now = new Date();
  return toIsoDate({ year: String(now.getFullYear()), month: String(now.getMonth() + 1), day: String(now.getDate()) })!;
}

// 활동 날짜로 쓸 수 있으면 YYYY-MM-DD를, 없는 날짜이거나 오늘 이후면 null을 돌려준다.
// 날짜 칸의 max는 달력에서 고를 때만 막으므로, 직접 입력한 값은 여기서 다시 거른다.
export function toActivityDate(parts: DateParts) {
  const isoDate = toIsoDate(parts);
  return isoDate && isoDate <= todayIsoDate() ? isoDate : null;
}

// 0~100 사이 정수면 숫자를, 아니면 null을 돌려준다.
export function parseTemperature(value: string) {
  if (!/^\d{1,3}$/.test(value)) return null;
  const temperature = Number(value);
  return temperature <= NEWRROW_MAX_TEMPERATURE ? temperature : null;
}

export function toNewrrowScore(temperature: number, maxScore: number) {
  return Math.min(Math.floor(temperature / NEWRROW_SCORE_STEP), maxScore);
}

export function parseAverageGrade(value: string) {
  if (!/^\d(\.\d{0,2})?$/.test(value)) return null;
  const grade = Number(value);
  return grade >= NCS_MIN_GRADE && grade <= NCS_MAX_GRADE ? grade : null;
}

export function roundGrade(grade: number) {
  return Math.round(grade);
}

export function toNcsScore(grade: number, maxScore: number) {
  return maxScore + 1 - roundGrade(grade);
}

// YYYY-MM-DD를 날짜 입력 칸 값으로 나눈다. 없으면 빈 칸을 돌려준다.
export function toDateParts(isoDate: string | undefined): DateParts {
  const [year, month, day] = isoDate?.split("-") ?? [];
  return year && month && day ? { year, month, day } : EMPTY_DATE;
}
