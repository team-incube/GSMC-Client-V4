import { useState } from "react";
import { toast } from "sonner";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import type { CertificationCategory } from "@/entities/certification";
import { parseTemperature, toNewrrowScore } from "../lib/format";
import { NEWRROW_SCORE_STEP, SUBMIT_ERROR_MESSAGE } from "../model/constants";
import { useSubmitScoreMutation } from "../model/submitScore";
import { FieldLabel } from "./FieldLabel";
import { FileField } from "./FileField";

type NewrrowSchoolFormProps = {
  category: CertificationCategory;
  onClose: () => void;
};

export function NewrrowSchoolForm({ category, onClose }: NewrrowSchoolFormProps) {
  const [temperatureInput, setTemperatureInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useSubmitScoreMutation();

  const temperature = parseTemperature(temperatureInput);
  // 서버와 같이 20점 단위로 내림한다.
  const score = temperature === null ? null : toNewrrowScore(temperature, category.maxScore);
  const invalid = temperatureInput !== "" && temperature === null;
  const tiers = Array.from({ length: category.maxScore }, (_, index) => index + 1);

  const handleSubmit = () => {
    if (temperature === null || !file) return;
    mutate(
      { categoryType: "NEWRROW_SCHOOL", entries: [{ id: crypto.randomUUID(), value: String(temperature), file }] },
      {
        onSuccess: () => {
          toast.success("뉴로우스쿨 참여를 제출했습니다.");
          onClose();
        },
        onError: () => toast.error(SUBMIT_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <ModalHeader
        title="뉴로우스쿨 참여"
        meta={`최대 ${category.maxScore}점`}
        metaSub={`회고온도 ${NEWRROW_SCORE_STEP}점당 1점`}
      />
      <ModalBody className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Input
            label="회고온도"
            unit="점"
            inputMode="numeric"
            placeholder="0 – 100"
            value={temperatureInput}
            aria-invalid={invalid || undefined}
            disabled={isPending}
            onChange={(event) => setTemperatureInput(event.target.value.replace(/\D/g, "").slice(0, 3))}
          />
          {invalid && (
            <p role="alert" className="text-[12px] leading-[18px] text-danger">
              0부터 100 사이로 입력해 주세요.
            </p>
          )}
        </div>
        <ol aria-label="회고온도별 점수" className="grid grid-cols-5 gap-1">
          {tiers.map((tier) => {
            const reached = score !== null && score >= tier;
            return (
              <li
                key={tier}
                className={`flex flex-col items-center rounded-md py-2 transition-colors duration-200 ${
                  reached ? "bg-brand text-white" : "bg-wash text-soft"
                }`}
              >
                <span className="text-[12px] leading-[18px] font-semibold">{tier}점</span>
                <span className="pt-0.5 text-[10px] leading-[15px] tracking-[0.08em] opacity-80">
                  {tier * NEWRROW_SCORE_STEP}+
                </span>
              </li>
            );
          })}
        </ol>
        {score !== null && (
          <div className="flex items-center justify-between rounded-lg bg-wash px-4 py-3 text-[13px] leading-[19.5px]">
            <span className="text-body">회고온도 {temperature}점</span>
            <span className="font-semibold tracking-[0.08em] text-strong">→ {score}점</span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <FieldLabel>증빙 파일</FieldLabel>
          <FileField placeholder="참여 확인서 첨부" file={file} disabled={isPending} onChange={setFile} />
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
