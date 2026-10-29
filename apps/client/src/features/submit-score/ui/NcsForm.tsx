import { useId, useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory } from "@/entities/certification";
import { parseAverageGrade, roundGrade, toNcsScore } from "../lib/format";
import { SUBMIT_ERROR_MESSAGE } from "../model/constants";
import { useSubmitScoreMutation } from "../model/submitScore";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import { ScoreSummary } from "./ScoreSummary";
import { GradeTiers } from "./GradeTiers";

type NcsFormProps = {
  category: CertificationCategory;
  onClose: () => void;
};

export function NcsForm({ category, onClose }: NcsFormProps) {
  const [gradeInput, setGradeInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useSubmitScoreMutation();
  const errorId = useId();

  const grade = parseAverageGrade(gradeInput);
  const rounded = grade === null ? null : roundGrade(grade);
  const score = grade === null ? null : toNcsScore(grade, category.maxScore);
  const invalid = gradeInput !== "" && grade === null;

  const handleSubmit = () => {
    if (grade === null || !file) return;
    mutate(
      {
        categoryType: "NCS",
        entries: [{ id: crypto.randomUUID(), value: String(grade), file }],
      },
      {
        onSuccess: () => {
          toast.success("직업기초능력평가를 제출했습니다.");
          onClose();
        },
        onError: () => toast.error(SUBMIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader title="직업기초능력평가" meta={`최대 ${category.maxScore}점`} metaSub="평균 등급 반올림" />
      <ModalBody className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Input
            label="평균 등급"
            unit="등급"
            inputMode="decimal"
            placeholder="1.0 – 5.0"
            value={gradeInput}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errorId : undefined}
            disabled={isPending}
            onChange={(event) => setGradeInput(event.target.value.replace(/[^\d.]/g, "").slice(0, 4))}
          />
          {invalid && (
            <p id={errorId} role="alert" className="text-[12px] leading-[18px] text-danger">
              1.0부터 5.0 사이로 입력해 주세요.
            </p>
          )}
        </div>
        <GradeTiers
          maxScore={category.maxScore}
          activeGrade={rounded}
          scoreOf={(tier) => toNcsScore(tier, category.maxScore)}
        />
        {grade !== null && rounded !== null && score !== null && (
          <ScoreSummary
            label={
              <>
                평균 {grade}등급
                {rounded !== grade && <span className="text-faint"> → {rounded}등급 반올림됨</span>}
              </>
            }
            score={score}
          />
        )}
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
