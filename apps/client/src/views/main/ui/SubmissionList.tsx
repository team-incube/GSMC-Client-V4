import {
  SUBMISSION_STATUS_LABEL,
  type CertificationSubmission,
  type SubmissionStatus,
} from "@/entities/certification";

const STATUS_CLASS: Record<SubmissionStatus, string> = {
  INCOMPLETE: "text-faint",
  APPROVED: "text-brand",
  PENDING: "text-caution",
  REJECTED: "text-danger",
};

type SubmissionListProps = {
  submissions: CertificationSubmission[];
  // 넘기면 수정할 수 있는 건 옆에 수정 버튼을 보여 준다.
  canEdit?: (submission: CertificationSubmission) => boolean;
  onEdit?: (submission: CertificationSubmission) => void;
};

export function SubmissionList({ submissions, canEdit, onEdit }: SubmissionListProps) {
  return (
    <div className="border-t border-line bg-page px-4 pt-3.25 pb-3 sm:px-6">
      {submissions.length === 0 ? (
        <p className="py-1.5 text-[12px] leading-[18px] text-faint">제출된 내역이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-line">
          {submissions.map((submission) => (
            <li key={submission.id} className="py-2.5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-[12px] leading-[18px] font-medium text-strong">{submission.title}</p>
                  {(submission.details.length > 0 || submission.fileName) && (
                    <p className="truncate text-[11px] leading-[16.5px] text-faint">
                      {[...submission.details, submission.fileName].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3 text-[11px] leading-[16.5px]">
                  {submission.submittedAt && (
                    <time dateTime={submission.submittedAt} className="text-soft">
                      {submission.submittedAt}
                    </time>
                  )}
                  <span className={`font-medium ${STATUS_CLASS[submission.status]}`}>
                    {SUBMISSION_STATUS_LABEL[submission.status]}
                  </span>
                  {submission.status === "APPROVED" && submission.score != null && (
                    <span className="font-medium text-strong">+{submission.score}점</span>
                  )}
                  {onEdit && canEdit?.(submission) && (
                    <button
                      type="button"
                      aria-label={`${submission.title} 수정`}
                      onClick={() => onEdit(submission)}
                      className="flex h-6 items-center rounded-[4px] border border-line bg-surface px-[9px] text-[10px] leading-[15px] font-medium text-body transition-colors hover:bg-wash focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                    >
                      수정
                    </button>
                  )}
                </div>
              </div>
              {submission.status === "REJECTED" && submission.rejectionReason && (
                <div className="mt-2 rounded-md border border-line bg-surface px-3 py-2">
                  <p className="text-[11px] leading-[16.5px] font-medium text-danger">반려 사유</p>
                  <p className="pt-0.5 text-[12px] leading-[18px] break-words whitespace-pre-line text-body">
                    {submission.rejectionReason}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
