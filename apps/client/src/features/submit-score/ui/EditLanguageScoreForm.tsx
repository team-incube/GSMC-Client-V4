import { useId, useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory, CertificationSubmission } from "@/entities/certification";
import { parseExamScore, toLanguageScore } from "../lib/format";
import { EDIT_ERROR_MESSAGE, LANGUAGE_MAX_EXAM_SCORE, LANGUAGE_SCORE_STEP } from "../model/constants";
import { useEditScoreMutation } from "../model/editScore";
import { CurrentFile } from "./CurrentFile";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import { ScoreSummary } from "./ScoreSummary";

type EditLanguageScoreFormProps = {
  category: CertificationCategory;
  submission: CertificationSubmission;
  onClose: () => void;
};

export function EditLanguageScoreForm({ category, submission, onClose }: EditLanguageScoreFormProps) {
  const [scoreInput, setScoreInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useEditScoreMutation();
  const errorId = useId();

  const examScore = parseExamScore(scoreInput);
  const score = examScore === null ? null : toLanguageScore(examScore, category.maxScore);
  const invalid = scoreInput !== "" && examScore === null;
  const changed = examScore !== null || file !== null;

  const handleSave = () => {
    mutate(
      {
        scoreId: submission.id,
        value: examScore === null ? undefined : String(examScore),
        file,
      },
      {
        onSuccess: () => {
          toast.success("공인점수를 수정했습니다.");
          onClose();
        },
        onError: () => toast.error(EDIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader
        title="공인점수 수정"
        subtitle="바꿀 항목만 입력하세요."
        meta={submission.score != null ? `현재 ${submission.score}점` : `최대 ${category.maxScore}점`}
        metaSub={`${LANGUAGE_SCORE_STEP}점당 1점`}
      />
      <ModalBody className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Input
            label="취득 점수"
            unit="점"
            inputMode="numeric"
            placeholder={`0 – ${LANGUAGE_MAX_EXAM_SCORE} (바꿀 때만 입력)`}
            value={scoreInput}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errorId : undefined}
            disabled={isPending}
            onChange={(event) => setScoreInput(event.target.value.replace(/\D/g, "").slice(0, 3))}
          />
          {invalid && (
            <p id={errorId} role="alert" className="text-[12px] leading-[18px] text-danger">
              1부터 {LANGUAGE_MAX_EXAM_SCORE} 사이로 입력해 주세요.
            </p>
          )}
        </div>
        {examScore !== null && score !== null && <ScoreSummary label={`취득 점수 ${examScore}점`} score={score} />}
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
