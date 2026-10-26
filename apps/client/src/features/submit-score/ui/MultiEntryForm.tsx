import { useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalFooter, ModalHeader, PlusIcon } from "@repo/ui";
import type { CertificationCategory, ScoreCategoryType } from "@/entities/certification";
import { EMPTY_DATE, isDateFilled, toActivityName, toIsoDate, type DateParts } from "../lib/format";
import { AWARD_TYPES, SUBMIT_ERROR_MESSAGE, type AwardType } from "../model/constants";
import { useSubmitScoreMutation, type ScoreEntry } from "../model/submitScore";
import { AwardTypeSelect } from "./AwardTypeSelect";
import { DateField } from "./DateField";
import { EntryList, type EntryListItem } from "./EntryList";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";

// 수상경력과 외부활동은 여러 건을 모아 한 번에 제출하는 같은 흐름이고, 입력 항목과 문구만 다르다.
export type MultiEntryConfig = {
  categoryType: ScoreCategoryType;
  title: string;
  successMessage: string;
  countUnit: string;
  sectionLabel: string;
  namePlaceholder: string;
  nameLabel: string;
  dateLabel: string;
  filePlaceholder: string;
  withAwardType: boolean;
  showEntryPoints: boolean;
};

type Entry = ScoreEntry & EntryListItem;

type Draft = {
  awardType: AwardType;
  name: string;
  date: DateParts;
  file: File | null;
};

const EMPTY_DRAFT: Draft = { awardType: AWARD_TYPES[0], name: "", date: EMPTY_DATE, file: null };

type MultiEntryFormProps = {
  config: MultiEntryConfig;
  category: CertificationCategory;
  onClose: () => void;
};

export function MultiEntryForm({ config, category, onClose }: MultiEntryFormProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [dateError, setDateError] = useState(false);
  const { mutate, isPending } = useSubmitScoreMutation();

  // 반려된 건은 다시 낼 수 있으니 세지 않는다.
  const submittedCount = category.submissions.filter((submission) => submission.status !== "REJECTED").length;
  const count = submittedCount + entries.length;
  const canAddMore = count < category.maxScore;
  const draftFilled = draft.name.trim() !== "" && isDateFilled(draft.date) && draft.file !== null;

  const updateDraft = (patch: Partial<Draft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleAdd = () => {
    const date = toIsoDate(draft.date);
    if (!date) {
      setDateError(true);
      return;
    }
    if (!draft.file) return;

    const name = draft.name.trim();
    const details = config.withAwardType ? [draft.awardType, date] : [date];
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        value: toActivityName(name, details),
        file: draft.file!,
        title: name,
        description: config.withAwardType ? details.join(" · ") : `${date} · ${draft.file!.name}`,
        points: config.showEntryPoints ? 1 : undefined,
      },
    ]);
    setDraft({ ...EMPTY_DRAFT, awardType: draft.awardType });
  };

  const handleSubmit = () => {
    mutate(
      {
        categoryType: config.categoryType,
        entries,
        onEntrySubmitted: (id) => setEntries((prev) => prev.filter((entry) => entry.id !== id)),
      },
      {
        onSuccess: () => {
          toast.success(config.successMessage);
          onClose();
        },
        onError: () => toast.error(SUBMIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader
        title={config.title}
        meta={`${count} / ${category.maxScore}${config.countUnit}`}
        metaSub={`${Math.min(count, category.maxScore)}점 / 최대 ${category.maxScore}점`}
      />
      <div className="flex-1 overflow-y-auto">
        {entries.length > 0 && (
          <EntryList
            items={entries}
            disabled={isPending}
            onRemove={(id) => setEntries((prev) => prev.filter((entry) => entry.id !== id))}
          />
        )}
        <div className="flex flex-col gap-3 px-6 py-5">
          <FieldLabel>{config.sectionLabel}</FieldLabel>
          {config.withAwardType && (
            <AwardTypeSelect
              value={draft.awardType}
              disabled={isPending}
              onChange={(awardType) => updateDraft({ awardType })}
            />
          )}
          <Input
            aria-label={config.nameLabel}
            placeholder={config.namePlaceholder}
            value={draft.name}
            disabled={isPending}
            onChange={(event) => updateDraft({ name: event.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <DateField
              label={config.dateLabel}
              value={draft.date}
              invalid={dateError}
              disabled={isPending}
              onChange={(date) => {
                setDateError(false);
                updateDraft({ date });
              }}
            />
            {dateError && (
              <p role="alert" className="text-[12px] leading-[18px] text-danger">
                올바른 날짜를 입력해 주세요.
              </p>
            )}
          </div>
          <FileField
            placeholder={config.filePlaceholder}
            file={draft.file}
            disabled={isPending}
            onChange={(file) => updateDraft({ file })}
          />
          <button
            type="button"
            disabled={!draftFilled || !canAddMore || isPending}
            onClick={handleAdd}
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-line text-[13px] leading-[19.5px] font-medium text-body transition-colors hover:bg-wash disabled:pointer-events-none disabled:opacity-50"
          >
            <PlusIcon aria-hidden="true" className="size-3.25" />
            추가하기
          </button>
          {!canAddMore && (
            <p className="text-[12px] leading-[18px] text-soft">
              최대 {category.maxScore}
              {config.countUnit}까지 제출할 수 있습니다.
            </p>
          )}
        </div>
      </div>
      <ModalFooter>
        <Button variant="secondary" disabled={isPending} onClick={onClose}>
          취소
        </Button>
        <Button disabled={entries.length === 0 || isPending} onClick={handleSubmit}>
          {isPending
            ? "제출 중…"
            : entries.length > 0
              ? `제출하기 (${entries.length}${config.countUnit} · ${entries.length}점)`
              : "제출하기"}
        </Button>
      </ModalFooter>
    </>
  );
}
