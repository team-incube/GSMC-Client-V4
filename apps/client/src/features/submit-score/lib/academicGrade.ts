import type { AcademicGradeEntry, AcademicGradeSheet, AcademicSubjectRow } from "@/entities/academic-grade";

// 3학년은 석차등급 대신 성취도 A~E를 입력하고, 서버가 1~5로 환산한다.
export const ACHIEVEMENT_LEVELS = ["A", "B", "C", "D", "E"] as const;
export const SUBJECT_GRADE_LEVELS = ["1", "2", "3", "4", "5"] as const;
const ACHIEVEMENT_GRADE_YEAR = 3;

// 학기·과목별 입력값. 키는 subjectKey로 만든다.
export type AcademicGradeValues = Record<string, string>;

export function subjectKey(semester: number, subjectName: string) {
  return `${semester}:${subjectName}`;
}

export function usesAchievement(sheet: AcademicGradeSheet) {
  return sheet.grade === ACHIEVEMENT_GRADE_YEAR;
}

export function toInitialValues(sheet: AcademicGradeSheet): AcademicGradeValues {
  const values: AcademicGradeValues = {};
  for (const { semester, subjects } of sheet.semesters) {
    for (const subject of subjects) {
      const value = usesAchievement(sheet) ? subject.achievement : subject.subjectGrade?.toString();
      if (value) values[subjectKey(semester, subject.subjectName)] = value;
    }
  }
  return values;
}

function toGradeNumber(value: string) {
  const achievementIndex = ACHIEVEMENT_LEVELS.indexOf(value as (typeof ACHIEVEMENT_LEVELS)[number]);
  return achievementIndex >= 0 ? achievementIndex + 1 : Number(value);
}

// 입력한 과목 등급의 단순 평균. 입력이 없으면 null. 서버 계산과 같은 기준이다.
export function semesterAverage(semester: number, subjects: AcademicSubjectRow[], values: AcademicGradeValues) {
  const grades = subjects
    .map((subject) => values[subjectKey(semester, subject.subjectName)])
    .filter((value): value is string => Boolean(value))
    .map(toGradeNumber);
  return grades.length > 0 ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length : null;
}

// 필수 과목이 모두 입력되고 택1 그룹마다 정확히 1개가 입력됐는지
export function isSemesterComplete(semester: number, subjects: AcademicSubjectRow[], values: AcademicGradeValues) {
  const filled = (subject: AcademicSubjectRow) => Boolean(values[subjectKey(semester, subject.subjectName)]);
  const requiredFilled = subjects
    .filter((subject) => subject.electiveGroup === null && !subject.optional)
    .every(filled);
  const groups = new Set(subjects.map((subject) => subject.electiveGroup).filter((group) => group !== null));
  const groupsFilled = [...groups].every(
    (group) => subjects.filter((subject) => subject.electiveGroup === group && filled(subject)).length === 1,
  );
  return requiredFilled && groupsFilled;
}

// 반올림 전 최종 평균 = 학기 평균들의 평균. 한 학기라도 덜 입력됐으면 null
export function finalAverage(sheet: AcademicGradeSheet, values: AcademicGradeValues) {
  const averages = sheet.semesters.map(({ semester, subjects }) =>
    isSemesterComplete(semester, subjects, values) ? semesterAverage(semester, subjects, values) : null,
  );
  if (averages.length === 0 || averages.some((average) => average === null)) return null;
  return (averages as number[]).reduce((sum, average) => sum + average, 0) / averages.length;
}

export function toAcademicGradeEntries(sheet: AcademicGradeSheet, values: AcademicGradeValues): AcademicGradeEntry[] {
  return sheet.semesters.flatMap(({ semester, subjects }) =>
    subjects.flatMap(({ subjectName }) => {
      const value = values[subjectKey(semester, subjectName)];
      return value ? [{ semester, subjectName, value }] : [];
    }),
  );
}

// 택1 그룹 과목을 고르면 같은 학기·그룹의 다른 과목 입력은 지운다. 같은 값을 다시 누르면 입력을 지운다.
export function setSubjectValue(
  values: AcademicGradeValues,
  semester: number,
  subjects: AcademicSubjectRow[],
  subject: AcademicSubjectRow,
  value: string,
): AcademicGradeValues {
  const key = subjectKey(semester, subject.subjectName);
  const next = { ...values };
  if (next[key] === value) {
    delete next[key];
    return next;
  }
  if (subject.electiveGroup !== null) {
    for (const other of subjects) {
      if (other.electiveGroup === subject.electiveGroup) delete next[subjectKey(semester, other.subjectName)];
    }
  }
  next[key] = value;
  return next;
}
