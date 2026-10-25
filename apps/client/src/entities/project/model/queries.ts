import { useQuery } from "@tanstack/react-query";
import { fetchMyProjects } from "../api/project";

export const projectKeys = {
  all: ["project"] as const,
  mine: () => [...projectKeys.all, "me"] as const,
};

export function useMyProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.mine(),
    queryFn: fetchMyProjects,
  });
}
