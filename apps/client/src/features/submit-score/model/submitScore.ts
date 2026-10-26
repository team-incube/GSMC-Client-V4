import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { addScoreWithFile, certificationKeys, type ScoreCategoryType } from "@/entities/certification";
import { uploadFile } from "@/entities/file";

export type ScoreEntry = {
  id: string;
  value: string;
  file: File;
};

type SubmitScoreVariables = {
  categoryType: ScoreCategoryType;
  entries: ScoreEntry[];
  // 한 건씩 신청하므로, 중간에 실패해도 이미 신청된 건을 목록에서 뺄 수 있게 알린다.
  onEntrySubmitted?: (entryId: string) => void;
};

const submitScoreKey = ["submit-score"] as const;

export function useSubmitScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: submitScoreKey,
    mutationFn: async ({ categoryType, entries, onEntrySubmitted }: SubmitScoreVariables) => {
      for (const entry of entries) {
        const fileId = await uploadFile(entry.file);
        await addScoreWithFile({ categoryType, value: entry.value, fileId });
        onEntrySubmitted?.(entry.id);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: certificationKeys.all }),
  });
}

export function useIsSubmittingScore() {
  return useIsMutating({ mutationKey: submitScoreKey }) > 0;
}
