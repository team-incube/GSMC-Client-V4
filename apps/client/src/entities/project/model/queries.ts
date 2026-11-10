import { useQuery } from "@tanstack/react-query";
import { fetchMyProjects, isForbiddenError } from "../api/project";

export const projectKeys = {
  all: ["project"] as const,
  mine: () => [...projectKeys.all, "me"] as const,
};

const myProjectsQueryOptions = {
  queryKey: projectKeys.mine(),
  queryFn: fetchMyProjects,
  // 권한 오류는 다시 시도해도 같으므로 재시도하지 않는다.
  retry: (failureCount: number, error: Error) => !isForbiddenError(error) && failureCount < 1,
};

export function useMyProjectsQuery() {
  return useQuery(myProjectsQueryOptions);
}

// DataGSM 프로젝트 단건 조회 API가 없어서, 내 프로젝트 목록에서 찾는다.
// 메인에서 목록을 이미 받았다면 캐시를 그대로 쓴다. 목록에 없으면 null이다.
export function useMyProjectQuery(projectId: string) {
  return useQuery({
    ...myProjectsQueryOptions,
    select: (projects) => projects.find((project) => project.id === projectId) ?? null,
  });
}
