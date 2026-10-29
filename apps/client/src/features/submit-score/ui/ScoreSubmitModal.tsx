import { Modal } from "@repo/ui";
import type { CertificationCategory, CertificationCategoryCode } from "@/entities/certification";
import { useIsSubmittingScore } from "../model/submitScore";
import { AWARD_CONFIG, EXTERNAL_ACTIVITY_CONFIG } from "./entryConfigs";
import { MultiEntryForm } from "./MultiEntryForm";
import { NcsForm } from "./NcsForm";
import { NewrrowSchoolForm } from "./NewrrowSchoolForm";
import { ReadingForm } from "./ReadingForm";

const SUBMITTABLE_CODES: CertificationCategoryCode[] = [
  "AWARD",
  "EXTERNAL_ACTIVITY",
  "NEWROW_SCHOOL",
  "READING",
  "JOB_SKILL",
];

export function canSubmitScore(code: CertificationCategoryCode) {
  return SUBMITTABLE_CODES.includes(code);
}

type ScoreSubmitModalProps = {
  category: CertificationCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ScoreSubmitModal({ category, open, onOpenChange }: ScoreSubmitModalProps) {
  const isSubmitting = useIsSubmittingScore();
  const close = () => onOpenChange(false);

  return (
    // 제출 중에는 닫히지 않게 막는다. 폼은 모달이 닫히면 언마운트되어 입력값이 초기화된다.
    <Modal open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      {category.code === "AWARD" && <MultiEntryForm config={AWARD_CONFIG} category={category} onClose={close} />}
      {category.code === "EXTERNAL_ACTIVITY" && (
        <MultiEntryForm config={EXTERNAL_ACTIVITY_CONFIG} category={category} onClose={close} />
      )}
      {category.code === "NEWROW_SCHOOL" && <NewrrowSchoolForm category={category} onClose={close} />}
      {category.code === "READING" && <ReadingForm category={category} onClose={close} />}
      {category.code === "JOB_SKILL" && <NcsForm category={category} onClose={close} />}
    </Modal>
  );
}
