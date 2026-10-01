# Report format

Write the report in **Korean**.

```
[HIGH] path/to/file.tsx:42 — 무엇이, 언제 깨지는지
[MED]  path/to/file.tsx:88 — …
[LOW]  path/to/file.tsx:13 — …

미확인: <검증하지 못한 항목과 필요한 확인>
리뷰 범위: <검사한 diff 범위, 사용한 관점, 생략한 관점과 이유, 단일 컨텍스트 리뷰 여부>
```

## Rules

- **Severity by consequence**, not by ease of fixing. HIGH = wrong for users now. MED = wrong in a realistic case. LOW = will bite someone later.
- **State what breaks.** "에러 처리 필요" is not a finding. "API가 빈 배열 대신 null을 주면 `map`에서 페이지 전체가 깨진다" is.
- **Skip style.** ESLint and the `reviewer` agent own that.
- **Say the diff looks fine when it does.** Write "발견한 문제 없음" with the scope. Invented findings train people to ignore reviews.
