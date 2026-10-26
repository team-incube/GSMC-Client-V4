import { Modal } from "@repo/ui";
import type { CertificationCategory, CertificationCategoryCode } from "@/entities/certification";
import { useIsSubmittingScore } from "../model/submitScore";
import { MultiEntryForm, type MultiEntryConfig } from "./MultiEntryForm";
import { NewrrowSchoolForm } from "./NewrrowSchoolForm";

const AWARD_CONFIG: MultiEntryConfig = {
  categoryType: "AWARD",
  title: "수상경력",
  successMessage: "수상경력을 제출했습니다.",
  countUnit: "개",
  sectionLabel: "수상 추가",
  nameLabel: "대회명 및 수상 내역",
  namePlaceholder: "대회명 및 수상 내역 (예: 전국 해커톤 대회 최우수상)",
  dateLabel: "수상 날짜",
  filePlaceholder: "수상 확인서 첨부",
  withAwardType: true,
  showEntryPoints: false,
};

const EXTERNAL_ACTIVITY_CONFIG: MultiEntryConfig = {
  categoryType: "EXTERNAL_ACTIVITY",
  title: "외부활동",
  successMessage: "외부활동을 제출했습니다.",
  countUnit: "건",
  sectionLabel: "활동 추가",
  nameLabel: "대회 및 외부활동명",
  namePlaceholder: "대회 및 외부활동명",
  dateLabel: "활동 날짜",
  filePlaceholder: "공문 등 증빙서류 첨부",
  withAwardType: false,
  showEntryPoints: true,
};

const SUBMITTABLE_CODES: CertificationCategoryCode[] = ["AWARD", "EXTERNAL_ACTIVITY", "NEWROW_SCHOOL"];

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
    </Modal>
  );
}
