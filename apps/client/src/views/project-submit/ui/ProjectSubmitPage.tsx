"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@repo/ui";
import type { Student } from "@/entities/member";
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  useSubmitProjectMutation,
} from "../model/submitProject";
import { ParticipantField } from "./ParticipantField";
import { ProjectImageField, type ProjectImage } from "./ProjectImageField";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6 p-6 sm:p-8">
      <h2 className="text-[11px] leading-[16.5px] font-medium tracking-[0.08em] text-soft">{title}</h2>
      {children}
    </section>
  );
}

type FieldLabelProps = { id?: string; htmlFor?: string; required?: boolean; children: ReactNode };

function FieldLabel({ id, htmlFor, required, children }: FieldLabelProps) {
  return (
    <label id={id} htmlFor={htmlFor} className="pb-1.5 text-[13px] leading-[19.5px] font-medium text-strong">
      {children} {required && <span className="text-danger">*</span>}
    </label>
  );
}

const FIELD_CLASS =
  "w-full rounded-md border border-line bg-surface px-3.25 text-base text-strong outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-faint focus:border-brand focus:shadow-[inset_0_0_0_1px_var(--brand)] disabled:opacity-50 md:text-[14px]";

export function ProjectSubmitPage() {
  const router = useRouter();
  const titleId = useId();
  const participantLabelId = useId();
  const descriptionId = useId();
  const descriptionHintId = useId();

  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState<Student[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<ProjectImage | null>(null);
  const { mutate, isPending } = useSubmitProjectMutation();

  const descriptionLength = description.trim().length;
  const canSubmit =
    title.trim().length > 0 &&
    descriptionLength >= DESCRIPTION_MIN_LENGTH &&
    !isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    mutate(
      {
        title: title.trim(),
        description: description.trim(),
        participantIds: participants.map((participant) => participant.id),
        image: image?.file ?? null,
      },
      {
        onSuccess: () => {
          toast.success("프로젝트를 제출했습니다.");
          router.push("/");
        },
        onError: () => toast.error("프로젝트를 제출하지 못했습니다. 잠시 후 다시 시도해 주세요."),
      },
    );
  };

  return (
    <main className="mx-auto w-full max-w-[672px] px-4 py-12 sm:px-6">
      <header className="border-b border-line pb-10">
        <h1 className="text-[28px] leading-[42px] font-semibold tracking-[-0.04em] text-strong sm:text-[32px] sm:leading-[48px]">
          프로젝트 제출
        </h1>
        <p className="pt-2 text-[15px] leading-[22.5px] break-keep text-body">
          프로젝트 참여 내역을 제출하면 검토 후 인증 점수에 반영됩니다.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="pt-10">
        <div className="divide-y divide-line rounded-xl border border-line bg-surface">
          <Section title="기본 정보">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <FieldLabel htmlFor={titleId} required>
                  프로젝트 이름
                </FieldLabel>
                <input
                  id={titleId}
                  value={title}
                  maxLength={TITLE_MAX_LENGTH}
                  disabled={isPending}
                  placeholder="프로젝트 이름을 입력하세요"
                  onChange={(event) => setTitle(event.target.value)}
                  className={`h-10 ${FIELD_CLASS}`}
                />
              </div>
              <div className="flex flex-col">
                <FieldLabel id={participantLabelId}>참여 인원</FieldLabel>
                <p className="text-[12px] leading-[18px] text-soft">
                  본인은 자동으로 포함돼요. 혼자 한 프로젝트라면 비워 두세요.
                </p>
                <ParticipantField
                  labelId={participantLabelId}
                  participants={participants}
                  onChange={setParticipants}
                  disabled={isPending}
                />
              </div>
            </div>
          </Section>

          <Section title="프로젝트 설명">
            <div className="flex flex-col">
              <FieldLabel htmlFor={descriptionId} required>
                설명
              </FieldLabel>
              <textarea
                id={descriptionId}
                value={description}
                maxLength={DESCRIPTION_MAX_LENGTH}
                disabled={isPending}
                aria-describedby={descriptionHintId}
                placeholder="프로젝트 내용, 역할, 기술 스택 등을 설명해 주세요."
                onChange={(event) => setDescription(event.target.value)}
                className={`h-[166px] resize-y py-2.75 leading-[22.75px] ${FIELD_CLASS}`}
              />
              <p
                id={descriptionHintId}
                className={`pt-1.5 text-right text-[12px] leading-[18px] ${
                  descriptionLength > 0 && descriptionLength < DESCRIPTION_MIN_LENGTH ? "text-caution" : "text-soft"
                }`}
              >
                {descriptionLength} / {DESCRIPTION_MAX_LENGTH}자 (최소 {DESCRIPTION_MIN_LENGTH}자)
              </p>
            </div>
          </Section>

          <Section title="프로젝트 사진">
            <ProjectImageField image={image} onChange={setImage} disabled={isPending} />
          </Section>
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={!canSubmit} className="text-[14px] leading-[21px]">
            {isPending ? "제출 중…" : "작성하기"}
          </Button>
        </div>
      </form>
    </main>
  );
}
