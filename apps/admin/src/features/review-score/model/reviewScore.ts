import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveScore, rejectScore, scoreKeys, type PendingScore } from "@/entities/score";
import { studentKeys } from "@/entities/student";

type ReviewVariables = { scoreId: string; decision: "approve" } | { scoreId: string; decision: "reject"; reason: string };

export function useReviewScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ReviewVariables) =>
      variables.decision === "approve"
        ? approveScore(variables.scoreId)
        : rejectScore(variables.scoreId, variables.reason),
    // 재조회가 끝나기 전에 같은 건을 다시 열어 중복 처리하지 않도록, 처리한 건을 목록 캐시에서 바로 뺀다.
    onSuccess: (_, { scoreId }) =>
      queryClient.setQueriesData<{ scores: PendingScore[]; failedCount: number }>(
        { queryKey: [...scoreKeys.all, "pending"] },
        (prev) => prev && { ...prev, scores: prev.scores.filter((score) => score.scoreId !== scoreId) },
      ),
    // 심사 결과는 학생 총점·항목별 점수에도 반영되므로 학생 쿼리도 함께 무효화한다.
    onSettled: () =>
      Promise.all([
        // 심사 목록은 학생 전체를 다시 조회해 무겁다. 처리한 건은 위에서 뺐으니 즉시 재조회하지 않고 다음 마운트 때 받는다.
        queryClient.invalidateQueries({ queryKey: scoreKeys.all, refetchType: "none" }),
        queryClient.invalidateQueries({ queryKey: studentKeys.all }),
      ]),
  });
}
