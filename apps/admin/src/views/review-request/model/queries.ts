import { useQuery } from "@tanstack/react-query";
import { fetchPendingScoreGroups, scoreKeys, toPendingScores } from "@/entities/score";
import { fetchStudentMembers } from "@/entities/student";

type Filter = { grade: number | null; classNumber: number | null };

async function fetchPendingScores(filter: Filter) {
  const members = await fetchStudentMembers(filter);
  const { groups, failedCount } = await fetchPendingScoreGroups(members.map((member) => member.id));
  return { scores: toPendingScores(groups, members), failedCount };
}

export function usePendingScoresQuery(filter: Filter) {
  return useQuery({
    queryKey: scoreKeys.pending(filter),
    queryFn: () => fetchPendingScores(filter),
    placeholderData: (previous) => previous,
  });
}
