import { useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import { type AwardCompetitionType, type CertificationSubmission } from "@/entities/certification";
import { isDateFilled, toActivityDate, toDateParts, toIsoDate, type DateParts } from "../lib/format";
import { EDIT_ERROR_MESSAGE } from "../model/constants";
import { useEditScoreMutation } from "../model/editScore";
import { AwardTypeSelect } from "./AwardTypeSelect";
import { CurrentFile } from "./CurrentFile";
import { DateField } from "./DateField";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import type { MultiEntryConfig } from "./MultiEntryForm";

type EditEntryFormProps = {
  config: MultiEntryConfig;
  submission: CertificationSubmission;
  onClose: () => void;
};

export function EditEntryForm({ config, submission, onClose }: EditEntryFormProps) {
  // 대회 종류 없이 낸 예전 제출 건은 임의의 값을 채우지 않고 직접 고르게 한다.
  const initialAwardType = submission.competitionType ?? null;
  const [awardType, setAwardType] = useState<AwardCompetitionType | null>(initialAwardType);
  const [name, setName] = useState(submission.title);
  const [date, setDate] = useState<DateParts>(toDateParts(submission.activityDate));
  const [file, setFile] = useState<File | null>(null);
  const [dateError, setDateError] = useState(false);
  const { mutate, isPending } = useEditScoreMutation();

  const filled = (!config.withAwardType || awardType !== null) && name.trim() !== "" && isDateFilled(date);
  const changed =
    (config.withAwardType && awardType !== initialAwardType) ||
    name.trim() !== submission.title ||
    toIsoDate(date) !== (submission.activityDate ?? null) ||
    file !== null;

  const handleSave = () => {
    const competitionType = config.withAwardType ? awardType : undefined;
    if (competitionType === null) return;
    const isoDate = toActivityDate(date);
    if (!isoDate) {
      setDateError(true);
      return;
    }
    mutate(
      {
        scoreId: submission.id,
        value: name.trim(),
        activityDate: isoDate,
        competitionType,
        file,
      },
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
              오늘까지의 올바른 날짜를 입력해 주세요.
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
