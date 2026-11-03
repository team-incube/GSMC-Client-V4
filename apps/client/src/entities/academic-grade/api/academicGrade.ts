import { graphqlRequest } from "@repo/lib";
import type { AcademicGradeEntry, AcademicGradeSheet } from "../model/types";

const SHEET_FIELDS = `
  grade
  semesters {
    semester
    subjects { subjectName electiveGroup optional subjectGrade achievement }
  }
`;

const MY_ACADEMIC_GRADE_SHEET = `
  query {
    myAcademicGradeSheet { ${SHEET_FIELDS} }
  }
`;

const SAVE_MY_ACADEMIC_GRADE_SHEET = `
  mutation($input: SaveAcademicGradeSheetInput!) {
    saveMyAcademicGradeSheet(input: $input) { grade }
  }
`;

const SUBMIT_MY_ACADEMIC_GRADE = `
  mutation {
    submitMyAcademicGrade { scoreId }
  }
`;

export async function fetchMyAcademicGradeSheet() {
  const { myAcademicGradeSheet } = await graphqlRequest<{ myAcademicGradeSheet: AcademicGradeSheet }>(
    MY_ACADEMIC_GRADE_SHEET,
  );
  return myAcademicGradeSheet;
}

// 입력표 전체를 덮어쓴다. 빠진 과목은 미입력으로 저장된다.
export async function saveMyAcademicGradeSheet(entries: AcademicGradeEntry[]) {
  await graphqlRequest(SAVE_MY_ACADEMIC_GRADE_SHEET, { input: { entries } });
}

// 저장된 입력표로 평균을 계산해 점수를 신청한다.
export async function submitMyAcademicGrade() {
  await graphqlRequest(SUBMIT_MY_ACADEMIC_GRADE);
}
