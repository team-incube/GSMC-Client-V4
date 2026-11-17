const KST_DATE_FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function toKstDate(dateTime: string): string {
  if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(dateTime)) return dateTime.slice(0, 10);
  const date = new Date(dateTime);
  return Number.isNaN(date.getTime()) ? dateTime.slice(0, 10) : KST_DATE_FORMAT.format(date);
}
