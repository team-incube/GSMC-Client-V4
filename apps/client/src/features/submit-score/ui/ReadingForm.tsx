import { useState } from "react";
import { toast } from "sonner";
import { Button, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory } from "@/entities/certification";
import { READING_COURSES, READING_SCORE_PER_COURSE, SUBMIT_ERROR_MESSAGE } from "../model/constants";
import { useSubmitScoreMutation } from "../model/submitScore";
import { CourseSelect } from "./CourseSelect";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";
import { ScoreSummary } from "./ScoreSummary";

type ReadingFormProps = {
  category: CertificationCategory;
  onClose: () => void;
};

export function ReadingForm({ category, onClose }: ReadingFormProps) {
  const [courseIndex, setCourseIndex] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useSubmitScoreMutation();

  const score = courseIndex === null ? null : (courseIndex + 1) * READING_SCORE_PER_COURSE;

  const handleSubmit = () => {
    if (score === null || !file) return;
    mutate(
      {
        categoryType: "READ_A_THON",
        entries: [{ id: crypto.randomUUID(), value: String(score), file }],
      },
      {
        onSuccess: () => {
          toast.success("독서활동을 제출했습니다.");
          onClose();
        },
        onError: () => toast.error(SUBMIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader
        title="독서활동"
        subtitle="빛고을독서마라톤"
        meta={`최대 ${category.maxScore}점`}
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
          <FileField placeholder="완주증명서 첨부" file={file} disabled={isPending} onChange={setFile} />
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
