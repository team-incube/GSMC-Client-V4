import { useId, useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory } from "@/entities/certification";
import { parseExamScore, toTopcitScore } from "../lib/format";
import { SUBMIT_ERROR_MESSAGE, TOPCIT_MAX_EXAM_SCORE, TOPCIT_SCORE_STEP } from "../model/constants";
import { useSubmitScoreMutation } from "../model/submitScore";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import { ScoreSummary } from "./ScoreSummary";

type TopcitFormProps = {
  category: CertificationCategory;
  onClose: () => void;
};

export function TopcitForm({ category, onClose }: TopcitFormProps) {
  const [scoreInput, setScoreInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useSubmitScoreMutation();
  const errorId = useId();

  const examScore = parseExamScore(scoreInput, TOPCIT_MAX_EXAM_SCORE);
  const score = examScore === null ? null : toTopcitScore(examScore, category.maxScore);
  const invalid = scoreInput !== "" && examScore === null;

  const handleSubmit = () => {
    if (examScore === null || !file) return;
    mutate(
      {
        categoryType: "TOPCIT",
        entries: [{ id: crypto.randomUUID(), value: String(examScore), file }],
      },
      {
        onSuccess: () => {
          toast.success("TOPCIT 점수를 제출했습니다.");
          onClose();
        },
        onError: () => toast.error(SUBMIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader
        title="TOPCIT"
        meta={`최대 ${category.maxScore}점`}
        metaSub={`${TOPCIT_SCORE_STEP}점당 1점 · 반올림`}
      />
      <ModalBody className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Input
            label="취득점수"
            unit="점"
            inputMode="numeric"
            placeholder={`0 – ${TOPCIT_MAX_EXAM_SCORE}`}
            value={scoreInput}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errorId : undefined}
            disabled={isPending}
            onChange={(event) => setScoreInput(event.target.value.replace(/\D/g, "").slice(0, 4))}
          />
          {invalid && (
            <p id={errorId} role="alert" className="text-[12px] leading-[18px] text-danger">
              1부터 {TOPCIT_MAX_EXAM_SCORE} 사이로 입력해 주세요.
            </p>
          )}
        </div>
        {examScore !== null && score !== null && <ScoreSummary label={`${examScore}점 획득`} score={score} />}
        <div className="flex flex-col gap-2">
          <FieldLabel>증빙 파일</FieldLabel>
          <FileField placeholder="성적 확인서 첨부" file={file} disabled={isPending} onChange={setFile} />
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
