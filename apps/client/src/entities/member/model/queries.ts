import { useQuery } from "@tanstack/react-query";
import { fetchAllStudents } from "../api/member";

export const memberKeys = {
  all: ["member"] as const,
  students: () => [...memberKeys.all, "students"] as const,
};

export function useStudentsQuery() {
  return useQuery({
    queryKey: memberKeys.students(),
    queryFn: fetchAllStudents,
    // 학생 명단은 자주 바뀌지 않는다.
    staleTime: 10 * 60 * 1000,
  });
}
