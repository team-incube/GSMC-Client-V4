import { graphqlRequest } from "@repo/lib";

const CLASS_SCORE_SHEET_URL = `
  query($grade: Int!, $classNumber: Int!) {
    classScoreSheetUrl(grade: $grade, classNumber: $classNumber)
  }
`;

const GRADE_SCORE_SHEET_URL = `
  query($grade: Int!) {
    gradeScoreSheetUrl(grade: $grade)
  }
`;

// 반까지 정해지면 학급 시트, 학년만 정해지면 학년 시트의 다운로드 URL을 받는다.
export async function fetchScoreSheetUrl(grade: number, classNumber: number | null) {
  if (classNumber != null) {
    const { classScoreSheetUrl } = await graphqlRequest<{ classScoreSheetUrl: string }>(CLASS_SCORE_SHEET_URL, {
      grade,
      classNumber,
    });
    return classScoreSheetUrl;
  }
  const { gradeScoreSheetUrl } = await graphqlRequest<{ gradeScoreSheetUrl: string }>(GRADE_SCORE_SHEET_URL, {
    grade,
  });
  return gradeScoreSheetUrl;
}
