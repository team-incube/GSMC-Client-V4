import { useId, useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory } from "@/entities/certification";
import { parseExamScore, toLanguageScore } from "../lib/format";
import {
  LANGUAGE_MAX_EXAM_SCORE,
  LANGUAGE_SCORE_STEP,
  SUBMIT_ERROR_MESSAGE,
  TOEIC_ACADEMY_BONUS,
  type LanguageExamType,
} from "../model/constants";
import { useSubmitLanguageScoreMutation } from "../model/submitScore";
import { AcademyCheckbox } from "./AcademyCheckbox";
import { ExamTypeSelect } from "./ExamTypeSelect";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import { ScoreSummary } from "./ScoreSummary";

type LanguageScoreFormProps = {
  category: CertificationCategory;
  onClose: () => void;
};

export function LanguageScoreForm({ category, onClose }: LanguageScoreFormProps) {
  const [examType, setExamType] = useState<LanguageExamType>("TOEIC");
  const [scoreInput, setScoreInput] = useState("");
  const [joinAcademy, setJoinAcademy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useSubmitLanguageScoreMutation();
  const errorId = useId();

  const academyApplied = examType === "TOEIC" && joinAcademy;
  const examScore = parseExamScore(scoreInput);
  const score =
    examScore === null
      ? null
      : Math.min(
          toLanguageScore(examScore, category.maxScore) + (academyApplied ? TOEIC_ACADEMY_BONUS : 0),
          category.maxScore,
        );
  const invalid = scoreInput !== "" && examScore === null;

  const handleSubmit = () => {
    if (examScore === null || !file) return;
    mutate(
      { examType, examScore, file, joinAcademy: academyApplied },
      {
        onSuccess: ({ academyFailed }) => {
          if (academyFailed) {
            toast.warning(
              "공인점수는 제출했지만 토익사관학교 참여는 신청하지 못했습니다. 공인점수를 다시 제출하면서 참여를 체크해 주세요.",
            );
          } else {
            toast.success("공인점수를 제출했습니다.");
          }
          onClose();
        },
        onError: () => toast.error(SUBMIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader title="공인점수" meta={`최대 ${category.maxScore}점`} metaSub={`${LANGUAGE_SCORE_STEP}점당 1점`} />
      <ModalBody className="flex flex-col gap-4">
        <ExamTypeSelect value={examType} disabled={isPending} onChange={setExamType} />
        <div className="flex flex-col gap-1.5">
          <Input
            label="취득 점수"
            unit="점"
            inputMode="numeric"
            placeholder={`0 – ${LANGUAGE_MAX_EXAM_SCORE}`}
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
        {examType === "TOEIC" && (
          <AcademyCheckbox checked={joinAcademy} disabled={isPending} onChange={setJoinAcademy} />
        )}
        {examScore !== null && score !== null && (
          <ScoreSummary
            label={
              <>
                {examType} {examScore}점{academyApplied && " + 토익사관학교"}
              </>
            }
            score={score}
          />
        )}
        <div className="flex flex-col gap-2">
          <FieldLabel>증빙 파일</FieldLabel>
          <FileField placeholder="성적표 첨부" file={file} disabled={isPending} onChange={setFile} />
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
