import { useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import { toActivityName, type CertificationSubmission } from "@/entities/certification";
import { isDateFilled, toDateParts, toIsoDate, type DateParts } from "../lib/format";
import { AWARD_TYPES, EDIT_ERROR_MESSAGE, type AwardType } from "../model/constants";
import { useEditScoreMutation } from "../model/editScore";
import { AwardTypeSelect } from "./AwardTypeSelect";
import { CurrentFile } from "./CurrentFile";
import { DateField } from "./DateField";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import type { MultiEntryConfig } from "./MultiEntryForm";

function toAwardType(value: string | undefined): AwardType {
  return AWARD_TYPES.find((type) => type === value) ?? AWARD_TYPES[0];
}

type EditEntryFormProps = {
  config: MultiEntryConfig;
  submission: CertificationSubmission;
  onClose: () => void;
};

export function EditEntryForm({ config, submission, onClose }: EditEntryFormProps) {
  const initialAwardType = toAwardType(submission.details[0]);
  const [awardType, setAwardType] = useState(initialAwardType);
  const [name, setName] = useState(submission.title);
  const [date, setDate] = useState<DateParts>(toDateParts(submission.activityDate));
  const [file, setFile] = useState<File | null>(null);
  const [dateError, setDateError] = useState(false);
  const { mutate, isPending } = useEditScoreMutation();

  const filled = name.trim() !== "" && isDateFilled(date);
  const changed =
    (config.withAwardType && awardType !== initialAwardType) ||
    name.trim() !== submission.title ||
    toIsoDate(date) !== (submission.activityDate ?? null) ||
    file !== null;

  const handleSave = () => {
    const isoDate = toIsoDate(date);
    if (!isoDate) {
      setDateError(true);
      return;
    }
    // 제출할 때와 같은 형식으로 활동명을 다시 만든다.
    const details = config.withAwardType ? [awardType, isoDate] : [isoDate];
    mutate(
      { scoreId: submission.id, value: toActivityName(name.trim(), details), file },
      {
        onSuccess: () => {
          toast.success(`${config.title} 제출 건을 수정했습니다.`);
          onClose();
        },
        onError: () => toast.error(EDIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader title={`${config.title} 수정`} subtitle="심사중인 제출 건만 수정할 수 있습니다." />
      <ModalBody className="flex flex-col gap-3">
        {config.withAwardType && <AwardTypeSelect value={awardType} disabled={isPending} onChange={setAwardType} />}
        <Input
          aria-label={config.nameLabel}
          placeholder={config.namePlaceholder}
          value={name}
          disabled={isPending}
          onChange={(event) => setName(event.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <DateField
            label={config.dateLabel}
            value={date}
            invalid={dateError}
            disabled={isPending}
            onChange={(next) => {
              setDateError(false);
              setDate(next);
            }}
          />
          {dateError && (
            <p role="alert" className="text-[12px] leading-[18px] text-danger">
              올바른 날짜를 입력해 주세요.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <FieldLabel>증빙 파일</FieldLabel>
          <CurrentFile fileName={submission.fileName} replaced={file !== null} />
          <FileField placeholder="새 파일로 교체 (선택)" file={file} disabled={isPending} onChange={setFile} />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" disabled={isPending} onClick={onClose}>
          취소
        </Button>
        <Button disabled={!filled || !changed || isPending} onClick={handleSave}>
          {isPending ? "저장 중…" : "저장하기"}
        </Button>
      </ModalFooter>
    </>
  );
}
