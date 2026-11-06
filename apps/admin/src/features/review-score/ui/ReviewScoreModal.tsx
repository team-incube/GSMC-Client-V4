"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button, EyeIcon, FileTextIcon, Modal, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { PendingScore } from "@/entities/score";
import { toSubmissionRows } from "../lib/submissionRows";
import { useReviewScoreMutation } from "../model/reviewScore";

const MAX_REASON_LENGTH = 500;

type ReviewScoreModalProps = {
  score: PendingScore;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formatClassInfo = ({ grade, classNumber, number }: PendingScore["student"]) =>
  grade == null || classNumber == null || number == null ? "" : `${grade}학년 ${classNumber}반 ${number}번`;

export function ReviewScoreModal({ score, open, onOpenChange }: ReviewScoreModalProps) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const review = useReviewScoreMutation();
  const rows = toSubmissionRows(score);
  const trimmedReason = reason.trim();

  const close = () => onOpenChange(false);

  const approve = () =>
    review.mutate(
      { scoreId: score.scoreId, decision: "approve" },
      {
        onSuccess: () => {
          toast.success("승인했어요.");
          close();
        },
        onError: () => toast.error("승인하지 못했어요. 다시 시도해 주세요."),
      },
    );

  const reject = () =>
    review.mutate(
      { scoreId: score.scoreId, decision: "reject", reason: trimmedReason },
      {
        onSuccess: () => {
          toast.success("반려했어요.");
          close();
        },
        onError: () => toast.error("반려하지 못했어요. 다시 시도해 주세요."),
      },
    );

  return (
    <Modal open={open} onOpenChange={(next) => !review.isPending && onOpenChange(next)}>
      <ModalHeader eyebrow="심사 요청" title={score.categoryName} />
      <ModalBody>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-wash px-4 py-3">
          <span className="truncate text-[14px] leading-[21px] font-semibold text-strong">{score.student.name}</span>
          <span className="shrink-0 text-[12px] leading-[18px] tracking-[0.08em] text-soft">
            {formatClassInfo(score.student)}
          </span>
        </div>

        {score.evidence && (
          <>
            <Section label="프로젝트">
              <p className="rounded-lg bg-wash px-4 py-3 text-[13px] leading-[19.5px] font-medium text-strong">
                {score.evidence.title}
              </p>
            </Section>
            <Section label="활동 내용">
              <p className="rounded-lg bg-wash px-4 py-3 text-[13px] leading-[22px] whitespace-pre-wrap text-body">
                {score.evidence.content}
              </p>
            </Section>
          </>
        )}

        {rows.length > 0 && (
          <Section label="제출 내용">
            <dl className="rounded-lg bg-wash px-4 py-1.5">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 border-b border-line/60 py-1.5 last:border-b-0"
                >
                  <dt className="shrink-0 text-[11px] leading-[16.5px] tracking-[0.08em] text-faint">{row.label}</dt>
                  <dd className="text-right text-[13px] leading-[19.5px] break-keep text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {score.files.length > 0 && (
          <Section label="증빙서류">
            <ul className="flex flex-col gap-2">
              {score.files.map((file) => (
                <li key={file.uri}>
                  <a
                    href={file.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${file.originalName} 새 창에서 보기`}
                    className="flex items-center gap-3 rounded-lg border border-line bg-wash px-[17px] py-[13px] transition-colors hover:border-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                  >
                    <FileTextIcon aria-hidden className="size-[15px] shrink-0 text-soft" />
                    <span className="min-w-0 flex-1 truncate text-[13px] leading-[19.5px] text-body">
                      {file.originalName}
                    </span>
                    <EyeIcon aria-hidden className="size-[13px] shrink-0 text-faint" />
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {rejecting && (
          <div className="pt-5">
            <label
              htmlFor="rejection-reason"
              className="block pb-2 text-[11px] leading-[16.5px] font-semibold tracking-[0.08em] text-danger"
            >
              반려 사유 (필수)
            </label>
            <textarea
              id="rejection-reason"
              autoFocus
              maxLength={MAX_REASON_LENGTH}
              placeholder="반려 사유를 입력하세요."
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="block h-[76.5px] w-full resize-none rounded-md border border-line bg-surface px-[13px] py-[9px] text-base text-body outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-faint focus:border-brand focus:shadow-[inset_0_0_0_1px_var(--brand)] md:text-[13px] md:leading-[19.5px]"
            />
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {rejecting ? (
          <>
            <Button variant="secondary" disabled={review.isPending} onClick={() => setRejecting(false)}>
              취소
            </Button>
            <Button variant="danger" disabled={!trimmedReason || review.isPending} onClick={reject}>
              반려 확인
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" className="flex-none!" onClick={close}>
              닫기
            </Button>
            <Button variant="danger" disabled={review.isPending} onClick={() => setRejecting(true)}>
              반려
            </Button>
            <Button disabled={review.isPending} onClick={approve}>
              승인
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="pt-5">
      <h3 className="pb-2 text-[11px] leading-[16.5px] font-medium tracking-[0.08em] text-soft">{label}</h3>
      {children}
    </section>
  );
}
