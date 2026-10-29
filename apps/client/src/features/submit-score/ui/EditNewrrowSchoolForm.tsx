import { useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory, CertificationSubmission } from "@/entities/certification";
import { parseTemperature, toNewrrowScore } from "../lib/format";
import { EDIT_ERROR_MESSAGE, NEWRROW_SCORE_STEP } from "../model/constants";
import { useEditScoreMutation } from "../model/editScore";
import { CurrentFile } from "./CurrentFile";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";

type EditNewrrowSchoolFormProps = {
  category: CertificationCategory;
  submission: CertificationSubmission;
  onClose: () => void;
};

export function EditNewrrowSchoolForm({ category, submission, onClose }: EditNewrrowSchoolFormProps) {
  // 서버에는 환산된 점수만 남아 회고온도는 비워 두고, 입력했을 때만 바꾼다.
  const [temperatureInput, setTemperatureInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useEditScoreMutation();

  const temperature = parseTemperature(temperatureInput);
  const score = temperature === null ? null : toNewrrowScore(temperature, category.maxScore);
  const invalid = temperatureInput !== "" && temperature === null;
  const changed = temperature !== null || file !== null;

  const handleSave = () => {
    mutate(
      { scoreId: submission.id, value: temperature === null ? undefined : String(temperature), file },
      {
        onSuccess: () => {
          toast.success("뉴로우스쿨 참여를 수정했습니다.");
          onClose();
        },
        onError: () => toast.error(EDIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader
        title="뉴로우스쿨 참여 수정"
        subtitle="바꿀 항목만 입력하세요."
        meta={submission.score != null ? `현재 ${submission.score}점` : undefined}
        metaSub={`회고온도 ${NEWRROW_SCORE_STEP}점당 1점`}
      />
      <ModalBody className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Input
            label="회고온도"
            unit="점"
            inputMode="numeric"
            placeholder="0 – 100 (바꿀 때만 입력)"
            value={temperatureInput}
            aria-invalid={invalid || undefined}
            disabled={isPending}
            onChange={(event) => setTemperatureInput(event.target.value.replace(/\D/g, "").slice(0, 3))}
          />
          {invalid && (
            <p role="alert" className="text-[12px] leading-[18px] text-danger">
              0부터 100 사이로 입력해 주세요.
            </p>
          )}
        </div>
        {score !== null && (
          <div className="flex items-center justify-between rounded-lg bg-wash px-4 py-3 text-[13px] leading-[19.5px]">
            <span className="text-body">회고온도 {temperature}점</span>
            <span className="font-semibold tracking-[0.08em] text-strong">→ {score}점</span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <FieldLabel>증빙 파일</FieldLabel>
          <CurrentFile fileName={submission.fileName} replaced={file !== null} />
          <FileField placeholder="새 파일로 교체 (선택)" file={file} disabled={isPending} onChange={setFile} />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" disabled={isPending} onClick={onClose}>
          취소
        </Button>
        <Button disabled={invalid || !changed || isPending} onClick={handleSave}>
          {isPending ? "저장 중…" : "저장하기"}
        </Button>
      </ModalFooter>
    </>
  );
}
