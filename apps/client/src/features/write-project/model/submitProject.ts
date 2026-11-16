import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GraphqlRequestError } from "@repo/lib";
import { certificationKeys } from "@/entities/certification";
import { projectKeys, submitProjectParticipation } from "@/entities/project";

const SUBMIT_ERROR_MESSAGE = "제출하지 못했습니다. 잠시 후 다시 시도해 주세요.";
const USER_FACING_ERROR_CODES = new Set(["BAD_REQUEST", "CONFLICT", "NOT_FOUND", "FORBIDDEN"]);

function getSubmitErrorMessage(error: Error) {
  if (error instanceof GraphqlRequestError && USER_FACING_ERROR_CODES.has(error.code) && error.message) {
    return error.message;
  }
  return SUBMIT_ERROR_MESSAGE;
}

export function useSubmitProjectMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: submitProjectParticipation,
    onSuccess: (_, { projectId }) => {
      toast.success("프로젝트를 제출했습니다.");
      router.replace(`/projects/${projectId}`);
    },
    onError: (error) => toast.error(getSubmitErrorMessage(error)),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: projectKeys.all }),
        queryClient.invalidateQueries({ queryKey: certificationKeys.all }),
      ]),
  });
}
