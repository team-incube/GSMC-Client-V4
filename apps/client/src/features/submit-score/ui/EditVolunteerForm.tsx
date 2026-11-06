import { useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory, CertificationSubmission } from "@/entities/certification";
import { EDIT_ERROR_MESSAGE } from "../model/constants";
import { useEditScoreMutation } from "../model/editScore";
import { CurrentFile } from "./CurrentFile";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import { ScoreSummary } from "./ScoreSummary";

type EditVolunteerFormProps = {
  category: CertificationCategory;
  submission: CertificationSubmission;
  onClose: () => void;
};

export function EditVolunteerForm({ category, submission, onClose }: EditVolunteerFormProps) {
  const [hoursInput, setHoursInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useEditScoreMutation();

  const hours = Number(hoursInput);
  const score = hours > 0 ? Math.min(hours, category.maxScore) : null;
  const changed = score !== null || file !== null;

  const handleSave = () => {
    mutate(
      {
        scoreId: submission.id,
        value: score === null ? undefined : String(score),
        file,
      },
      {
        onSuccess: () => {
          toast.success("봉사활동을 수정했습니다.");
          onClose();
        },
        onError: () => toast.error(EDIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader
        title="봉사활동 수정"
        subtitle="바꿀 항목만 입력하세요."
        meta={submission.score != null ? `현재 ${submission.score}점` : `최대 ${category.maxScore}점`}
        metaSub="시간당 1점"
      />
      <ModalBody className="flex flex-col gap-4">
        <Input
          label="봉사 시간"
          unit="시간"
          inputMode="numeric"
          placeholder="바꿀 때만 입력"
          value={hoursInput}
          disabled={isPending}
          onChange={(event) => setHoursInput(event.target.value.replace(/\D/g, "").slice(0, 3))}
        />
        {score !== null && (
          <ScoreSummary
            label={
              <>
                {hours}시간
                {hours > category.maxScore && <span className="text-faint"> (최대 {category.maxScore}시간 반영)</span>}
              </>
            }
            score={score}
          />
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
        <Button disabled={!changed || isPending} onClick={handleSave}>
          {isPending ? "저장 중…" : "저장하기"}
        </Button>
      </ModalFooter>
    </>
  );
}
