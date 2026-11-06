import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveScore, rejectScore, scoreKeys } from "@/entities/score";

type ReviewVariables = { scoreId: string; decision: "approve" } | { scoreId: string; decision: "reject"; reason: string };

export function useReviewScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ReviewVariables) =>
      variables.decision === "approve"
        ? approveScore(variables.scoreId)
        : rejectScore(variables.scoreId, variables.reason),
    onSettled: () => queryClient.invalidateQueries({ queryKey: scoreKeys.all }),
  });
}
