import { useState } from "react";
import { toast } from "sonner";
import { Button, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory, CertificationSubmission } from "@/entities/certification";
import { EDIT_ERROR_MESSAGE, READING_COURSES, READING_SCORE_PER_COURSE } from "../model/constants";
import { useEditScoreMutation } from "../model/editScore";
import { CourseSelect } from "./CourseSelect";
import { CurrentFile } from "./CurrentFile";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import { ScoreSummary } from "./ScoreSummary";

type EditReadingFormProps = {
  category: CertificationCategory;
  submission: CertificationSubmission;
  onClose: () => void;
};

function toCourseIndex(score: number | undefined) {
  if (score === undefined) return null;
  const index = Math.round(score / READING_SCORE_PER_COURSE) - 1;
  return index >= 0 && index < READING_COURSES.length ? index : null;
}

export function EditReadingForm({ category, submission, onClose }: EditReadingFormProps) {
  const initialIndex = toCourseIndex(submission.score);
  const [courseIndex, setCourseIndex] = useState<number | null>(initialIndex);
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useEditScoreMutation();

  const score = courseIndex === null ? null : (courseIndex + 1) * READING_SCORE_PER_COURSE;
  const courseChanged = score !== null && courseIndex !== initialIndex;
  const changed = courseChanged || file !== null;

  const handleSave = () => {
    mutate(
      {
        scoreId: submission.id,
        value: courseChanged ? String(score) : undefined,
        file,
      },
      {
        onSuccess: () => {
          toast.success("독서활동을 수정했습니다.");
          onClose();
        },
        onError: () => toast.error(EDIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader
        title="독서활동 수정"
        subtitle="바꿀 항목만 수정하세요."
        meta={submission.score != null ? `현재 ${submission.score}점` : `최대 ${category.maxScore}점`}
        metaSub={`코스별 ${READING_SCORE_PER_COURSE}점`}
      />
      <ModalBody className="flex flex-col gap-4">
        <CourseSelect
          courses={READING_COURSES}
          selectedIndex={courseIndex}
          disabled={isPending}
          onChange={setCourseIndex}
        />
        {courseIndex !== null && score !== null && (
          <ScoreSummary label={`${READING_COURSES[courseIndex]} 코스 완료`} score={score} />
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
