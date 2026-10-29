import { Modal } from "@repo/ui";
import type { CertificationCategory, CertificationSubmission } from "@/entities/certification";
import { useIsEditingScore } from "../model/editScore";
import { EditEntryForm } from "./EditEntryForm";
import { EditNewrrowSchoolForm } from "./EditNewrrowSchoolForm";
import { AWARD_CONFIG, EXTERNAL_ACTIVITY_CONFIG } from "./entryConfigs";

// 서버는 심사중인 점수만 수정을 받는다.
export function canEditSubmission(submission: CertificationSubmission) {
  return submission.status === "PENDING";
}

type ScoreEditModalProps = {
  category: CertificationCategory;
  // 수정할 제출 건. null이면 모달이 닫힌다.
  submission: CertificationSubmission | null;
  onClose: () => void;
};

export function ScoreEditModal({ category, submission, onClose }: ScoreEditModalProps) {
  const isEditing = useIsEditingScore();

  return (
    // 저장 중에는 닫히지 않게 막는다. 제출 건이 바뀌면 key로 폼을 새로 만든다.
    <Modal open={submission !== null} onOpenChange={(next) => !next && !isEditing && onClose()}>
      {submission && category.code === "AWARD" && (
        <EditEntryForm key={submission.id} config={AWARD_CONFIG} submission={submission} onClose={onClose} />
      )}
      {submission && category.code === "EXTERNAL_ACTIVITY" && (
        <EditEntryForm
          key={submission.id}
          config={EXTERNAL_ACTIVITY_CONFIG}
          submission={submission}
          onClose={onClose}
        />
      )}
      {submission && category.code === "NEWROW_SCHOOL" && (
        <EditNewrrowSchoolForm key={submission.id} category={category} submission={submission} onClose={onClose} />
      )}
    </Modal>
  );
}
