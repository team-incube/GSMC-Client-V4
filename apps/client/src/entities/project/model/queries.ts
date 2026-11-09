import { useQuery } from "@tanstack/react-query";
import { fetchMyProjects, isForbiddenError } from "../api/project";

export const projectKeys = {
  all: ["project"] as const,
  mine: () => [...projectKeys.all, "me"] as const,
};

export function useMyProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.mine(),
    queryFn: fetchMyProjects,
    // 권한 오류는 다시 시도해도 같으므로 재시도하지 않는다.
    retry: (failureCount, error) => !isForbiddenError(error) && failureCount < 1,
  });
}
