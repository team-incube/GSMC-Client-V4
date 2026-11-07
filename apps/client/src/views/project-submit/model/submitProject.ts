import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/entities/file";
import { createProject, projectKeys } from "@/entities/project";

// 서버 검증(ProjectServiceSupport)과 같은 값이다.
export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MIN_LENGTH = 300;
export const DESCRIPTION_MAX_LENGTH = 2000;

type SubmitProjectVariables = {
  title: string;
  description: string;
  participantIds: string[];
  image: File | null;
};

export function useSubmitProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ image, ...input }: SubmitProjectVariables) => {
      const fileIds = image ? [await uploadFile(image)] : [];
      return createProject({ ...input, fileIds });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
