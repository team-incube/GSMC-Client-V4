const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const WITH_DETAILS = /^(.*) \(([^()]*)\)$/;

// TODO: 서버에 대회 종류·날짜 필드가 생기면 따로 보낸다. (team-incube/GSMC-Server-V4#282)
// 그전까지는 심사 교사가 볼 수 있도록 활동명 하나에 "제목 (종류 · 날짜)"로 합쳐 보낸다.
export function toActivityName(title: string, details: string[]) {
  return `${title} (${details.join(" · ")})`;
}

// toActivityName으로 합친 활동명을 제목, 날짜, 나머지 정보로 나눈다. 형식이 다르면 통째로 제목이 된다.
export function parseActivityName(activityName: string) {
  const match = WITH_DETAILS.exec(activityName);
  const parts = match ? match[2].split(" · ") : [];
  const date = parts.at(-1);
  if (!match || !date || !ISO_DATE.test(date)) {
    return { title: activityName, date: undefined, details: [] };
  }
  return { title: match[1], date, details: parts.slice(0, -1) };
}
