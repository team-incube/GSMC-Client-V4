import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { certificationKeys, patchMyScore } from "@/entities/certification";
import { uploadFile } from "@/entities/file";

type EditScoreVariables = {
  scoreId: string;
  value?: string;
  // 새로 고른 파일이 있을 때만 교체한다.
  file?: File | null;
};

const editScoreKey = ["edit-score"] as const;

export function useEditScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: editScoreKey,
    mutationFn: async ({ scoreId, value, file }: EditScoreVariables) => {
      const fileId = file ? await uploadFile(file) : undefined;
      await patchMyScore({ scoreId, value, fileId });
    },
    // 실패했을 때도 그사이 심사가 끝났을 수 있으니 목록을 새로 받는다.
    onSettled: () => queryClient.invalidateQueries({ queryKey: certificationKeys.all }),
  });
}

export function useIsEditingScore() {
  return useIsMutating({ mutationKey: editScoreKey }) > 0;
}
