export const GRADE_OPTIONS = [1, 2] as const;
export const CLASS_OPTIONS = [1, 2, 3, 4] as const;

export type StudentListFilter = {
  grade: number | null;
  classNumber: number | null;
  name: string;
};

export const INITIAL_FILTER: StudentListFilter = { grade: null, classNumber: null, name: "" };
