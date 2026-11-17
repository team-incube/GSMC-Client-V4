export type AcademicSubjectRow = {
  subjectName: string;
  // 같은 그룹 과목 중 정확히 1개를 입력해야 한다. 필수 과목은 null
  electiveGroup: string | null;
  // 선택자만 수강하는 과목. 입력했을 때만 평균에 포함된다.
  optional: boolean;
  // 1~5. 3학년은 성취도 A~E를 1~5로 환산한 값
  subjectGrade: number | null;
  // 3학년의 성취도(A~E)
  achievement: string | null;
};

export type AcademicGradeSheet = {
  grade: number;
  semesters: { semester: number; subjects: AcademicSubjectRow[] }[];
};

// 1·2학년은 석차등급 "1"~"5", 3학년은 성취도 "A"~"E"
export type AcademicGradeEntry = {
  semester: number;
  subjectName: string;
  value: string;
};
