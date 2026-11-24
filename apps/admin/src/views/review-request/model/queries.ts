import { useQuery } from "@tanstack/react-query";
import { fetchPendingScoreItems, scoreKeys, toPendingScores } from "@/entities/score";

type Filter = { grade: number | null; classNumber: number | null };

async function fetchPendingScores(filter: Filter) {
  return { scores: toPendingScores(await fetchPendingScoreItems(filter)) };
}

export function usePendingScoresQuery(filter: Filter) {
  return useQuery({
    queryKey: scoreKeys.pending(filter),
    queryFn: () => fetchPendingScores(filter),
    placeholderData: (previous) => previous,
  });
}
