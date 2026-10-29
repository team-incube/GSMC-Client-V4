const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const WITH_DETAILS = /^(.*) \(([^()]*)\)$/;

// 서버에 활동일·대회 종류 필드가 생기기 전에는 활동명 하나에 "제목 (종류 · 날짜)"로 합쳐 보냈다.
// 그렇게 합친 활동명을 제목, 날짜, 나머지 정보로 나눈다. 형식이 다르면 통째로 제목이 된다.
export function parseActivityName(activityName: string) {
  const match = WITH_DETAILS.exec(activityName);
  const parts = match ? match[2].split(" · ") : [];
  const date = parts.at(-1);
  if (!match || !date || !ISO_DATE.test(date)) {
    return { title: activityName, date: undefined, details: [] };
  }
  return { title: match[1], date, details: parts.slice(0, -1) };
}
