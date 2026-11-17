import { useQuery } from "@tanstack/react-query";
import { fetchDataGsmProject, isNotFoundError } from "../api/project";

export const projectKeys = {
  all: ["projects"] as const,
  dataGsm: (dgProjectId: string) => [...projectKeys.all, "datagsm", dgProjectId] as const,
};

// 서버가 캐시 없이 DataGSM을 직접 호출하므로, 심사자가 프로젝트를 펼쳤을 때만 조회한다.
export function useDataGsmProjectQuery(dgProjectId: string, enabled: boolean) {
  return useQuery({
    queryKey: projectKeys.dataGsm(dgProjectId),
    queryFn: () => fetchDataGsmProject(dgProjectId),
    enabled,
    staleTime: 5 * 60 * 1000,
    // 없는 프로젝트는 다시 시도해도 같으므로 재시도하지 않는다.
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 1,
  });
}
