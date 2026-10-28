import { CERTIFICATION_CATEGORIES, sumCategoryScore } from "@repo/lib";
import { useQuery } from "@tanstack/react-query";
import { fetchScoresByCategory, fetchStudentMembers, fetchTotalScores } from "../api/student";
import type { Student, StudentCategoryScore, StudentFilter } from "./types";

export const studentKeys = {
  all: ["students"] as const,
  list: (filter: StudentFilter) => [...studentKeys.all, "list", filter] as const,
  categoryScores: (memberId: string) => [...studentKeys.all, "category-scores", memberId] as const,
};

const compareNullable = (a: number | null, b: number | null) => (a ?? Infinity) - (b ?? Infinity);

async function fetchStudents(filter: StudentFilter): Promise<Student[]> {
  const members = await fetchStudentMembers(filter);
  const totalScores = await fetchTotalScores(members);

  return members
    .map((member) => ({ ...member, totalScore: totalScores.get(member.id) ?? null }))
    .sort(
      (a, b) =>
        compareNullable(a.grade, b.grade) ||
        compareNullable(a.classNumber, b.classNumber) ||
        compareNullable(a.number, b.number),
    );
}

async function fetchStudentCategoryScores(memberId: string): Promise<StudentCategoryScore[]> {
  const groups = await fetchScoresByCategory(memberId);
  return CERTIFICATION_CATEGORIES.map((config) => ({
    code: config.code,
    name: config.name,
    maxScore: config.maxScore,
    score: sumCategoryScore(config, groups),
  }));
}

export function useStudentsQuery(filter: StudentFilter) {
  return useQuery({
    queryKey: studentKeys.list(filter),
    queryFn: () => fetchStudents(filter),
    placeholderData: (previous) => previous,
  });
}

export function useStudentCategoryScoresQuery(memberId: string, enabled: boolean) {
  return useQuery({
    queryKey: studentKeys.categoryScores(memberId),
    queryFn: () => fetchStudentCategoryScores(memberId),
    enabled,
  });
}
