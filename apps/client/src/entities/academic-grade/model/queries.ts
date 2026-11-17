import { useQuery } from "@tanstack/react-query";
import { fetchMyAcademicGradeSheet } from "../api/academicGrade";

export const academicGradeKeys = {
  sheet: ["academic-grade", "sheet"] as const,
};

export function useMyAcademicGradeSheetQuery() {
  return useQuery({
    queryKey: academicGradeKeys.sheet,
    queryFn: fetchMyAcademicGradeSheet,
  });
}
