import { useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory } from "@/entities/certification";
import { SUBMIT_ERROR_MESSAGE } from "../model/constants";
import { useSubmitScoreMutation } from "../model/submitScore";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import { ScoreSummary } from "./ScoreSummary";

type VolunteerFormProps = {
  category: CertificationCategory;
  onClose: () => void;
};

// 시간당 1점이라 반영 시간 상한이 곧 만점이다.
export function VolunteerForm({ category, onClose }: VolunteerFormProps) {
  const [hoursInput, setHoursInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useSubmitScoreMutation();

  const hours = Number(hoursInput);
  const score = hours > 0 ? Math.min(hours, category.maxScore) : null;

  const handleSubmit = () => {
    if (score === null || !file) return;
    mutate(
      { categoryType: "VOLUNTEER", entries: [{ id: crypto.randomUUID(), value: String(hours), file }] },
      {
        onSuccess: () => {
          toast.success("봉사활동을 제출했습니다.");
          onClose();
        },
        onError: () => toast.error(SUBMIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader title="봉사활동" meta={`최대 ${category.maxScore}점`} metaSub="시간당 1점" />
      <ModalBody className="flex flex-col gap-4">
        <Input
          label="봉사 시간"
          unit="시간"
          inputMode="numeric"
          placeholder="0"
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
        <p className="text-[12px] leading-5 text-faint">
          교육과정의 봉사활동은 제외됩니다. 1365 봉사 포털 기준으로 인정됩니다.
        </p>
        <div className="flex flex-col gap-2">
          <FieldLabel>증빙 파일</FieldLabel>
          <FileField placeholder="봉사 확인서 첨부 (1365)" file={file} disabled={isPending} onChange={setFile} />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" disabled={isPending} onClick={onClose}>
          취소
        </Button>
        <Button disabled={score === null || !file || isPending} onClick={handleSubmit}>
          {isPending ? "제출 중…" : score !== null ? `제출하기 (${score}점)` : "제출하기"}
        </Button>
      </ModalFooter>
    </>
  );
}
