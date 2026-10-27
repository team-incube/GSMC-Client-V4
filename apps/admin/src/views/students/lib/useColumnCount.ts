import { useSyncExternalStore } from "react";

// 표에 보이는 열 수. StudentTable의 sm:/md: 열 숨김 규칙과 맞춰야 한다.
// 숨긴 열까지 colSpan에 넣으면 빈 열이 생겨 표가 한쪽으로 쏠린다.
const SM_QUERY = "(min-width: 40rem)";
const MD_QUERY = "(min-width: 48rem)";
const FULL_COLUMN_COUNT = 5;

function subscribe(onChange: () => void) {
  const queries = [SM_QUERY, MD_QUERY].map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () => queries.forEach((query) => query.removeEventListener("change", onChange));
}

function getSnapshot() {
  if (window.matchMedia(MD_QUERY).matches) return FULL_COLUMN_COUNT;
  if (window.matchMedia(SM_QUERY).matches) return 4;
  return 3;
}

export function useColumnCount() {
  return useSyncExternalStore(subscribe, getSnapshot, () => FULL_COLUMN_COUNT);
}
