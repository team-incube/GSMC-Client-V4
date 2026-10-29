import { useId, useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory, CertificationSubmission } from "@/entities/certification";
import { parseAverageGrade, roundGrade, toNcsScore } from "../lib/format";
import { EDIT_ERROR_MESSAGE } from "../model/constants";
import { useEditScoreMutation } from "../model/editScore";
import { CurrentFile } from "./CurrentFile";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import { ScoreSummary } from "./ScoreSummary";
import { GradeTiers } from "./GradeTiers";

type EditNcsFormProps = {
  category: CertificationCategory;
  submission: CertificationSubmission;
  onClose: () => void;
};

export function EditNcsForm({ category, submission, onClose }: EditNcsFormProps) {
  const [gradeInput, setGradeInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useEditScoreMutation();
  const errorId = useId();

  const grade = parseAverageGrade(gradeInput);
  const rounded = grade === null ? null : roundGrade(grade);
  const score = grade === null ? null : toNcsScore(grade, category.maxScore);
  const invalid = gradeInput !== "" && grade === null;
  const changed = grade !== null || file !== null;

  const handleSave = () => {
    mutate(
      {
        scoreId: submission.id,
        value: grade === null ? undefined : String(grade),
        file,
      },
      {
        onSuccess: () => {
          toast.success("직업기초능력평가를 수정했습니다.");
          onClose();
        },
        onError: () => toast.error(EDIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader
        title="직업기초능력평가 수정"
        subtitle="바꿀 항목만 입력하세요."
        meta={submission.score != null ? `현재 ${submission.score}점` : `최대 ${category.maxScore}점`}
        metaSub="평균 등급 반올림"
      />
      <ModalBody className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Input
            label="평균 등급"
            unit="등급"
            inputMode="decimal"
            placeholder="1.0 – 5.0 (바꿀 때만 입력)"
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
