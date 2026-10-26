import { NEWRROW_MAX_TEMPERATURE, NEWRROW_SCORE_STEP } from "../model/constants";

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

// TODO: 서버에 대회 종류·날짜 필드가 생기면 따로 보낸다. (team-incube/GSMC-Server-V4#282)
// 그전까지는 심사 교사가 볼 수 있도록 활동명 하나에 합쳐 보낸다.
export function toActivityName(title: string, details: string[]) {
  return `${title} (${details.join(" · ")})`;
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
