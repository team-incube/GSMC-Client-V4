import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveScore, rejectScore, scoreKeys } from "@/entities/score";
import { studentKeys } from "@/entities/student";

type ReviewVariables = { scoreId: string; decision: "approve" } | { scoreId: string; decision: "reject"; reason: string };

export function useReviewScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ReviewVariables) =>
      variables.decision === "approve"
        ? approveScore(variables.scoreId)
        : rejectScore(variables.scoreId, variables.reason),
    // 심사 결과는 학생 총점·항목별 점수에도 반영되므로 학생 쿼리도 함께 무효화한다.
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: scoreKeys.all }),
        queryClient.invalidateQueries({ queryKey: studentKeys.all }),
      ]),
  });
}
