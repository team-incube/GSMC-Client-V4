import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import { useMyAcademicGradeSheetQuery, type AcademicGradeSheet, type AcademicSubjectRow } from "@/entities/academic-grade";
import type { CertificationCategory } from "@/entities/certification";
import {
  ACHIEVEMENT_LEVELS,
  SUBJECT_GRADE_LEVELS,
  finalAverage,
  semesterAverage,
  setSubjectValue,
  subjectKey,
  toAcademicGradeEntries,
  toInitialValues,
  usesAchievement,
} from "../lib/academicGrade";
import { roundGrade, toNcsScore } from "../lib/format";
import { SUBMIT_ERROR_MESSAGE } from "../model/constants";
import { useSubmitAcademicGradeMutation } from "../model/submitScore";
import { FieldLabel } from "./FieldLabel";
import { GradeTiers } from "./GradeTiers";
import { ScoreSummary } from "./ScoreSummary";

type AcademicGradeFormProps = {
  category: CertificationCategory;
  onClose: () => void;
};

export function AcademicGradeForm({ category, onClose }: AcademicGradeFormProps) {
  const { data: sheet, isPending, isError } = useMyAcademicGradeSheetQuery();
  const header = (
    <ModalHeader
      title={category.name}
      subtitle={sheet && `${sheet.grade}학년 과목별 ${usesAchievement(sheet) ? "성취도" : "석차등급"}`}
      meta={`최대 ${category.maxScore}점`}
      metaSub="평균 등급 반올림"
    />
  );

  if (!sheet) {
    return (
      <>
        {header}
        <ModalBody>
          <p role={isError ? "alert" : "status"} className="py-6 text-center text-[13px] leading-[19.5px] text-soft">
            {isPending ? "과목 목록을 불러오는 중…" : "과목 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </>
    );
  }

  return <SheetForm header={header} sheet={sheet} category={category} onClose={onClose} />;
}

type SheetFormProps = {
  header: ReactNode;
  sheet: AcademicGradeSheet;
  category: CertificationCategory;
  onClose: () => void;
};

function SheetForm({ header, sheet, category, onClose }: SheetFormProps) {
  const [values, setValues] = useState(() => toInitialValues(sheet));
  const { mutate, isPending } = useSubmitAcademicGradeMutation();

  const average = finalAverage(sheet, values);
  const rounded = average === null ? null : roundGrade(average);
  const score = average === null ? null : toNcsScore(average, category.maxScore);
  const levels = usesAchievement(sheet) ? ACHIEVEMENT_LEVELS : SUBJECT_GRADE_LEVELS;

  const handleSubmit = () => {
    if (score === null) return;
    mutate(toAcademicGradeEntries(sheet, values), {
      onSuccess: () => {
        toast.success("교과성적을 제출했습니다.");
        onClose();
      },
      onError: () => toast.error(SUBMIT_ERROR_MESSAGE),
    });
  };

  return (
    <>
      {header}
      <ModalBody className="flex flex-col gap-5">
        {sheet.semesters.map(({ semester, subjects }) => {
          const semesterAvg = semesterAverage(semester, subjects, values);
          return (
            <section key={semester} aria-label={`${semester}학기`} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <FieldLabel>{semester}학기</FieldLabel>
                <span className="text-[11px] leading-[16.5px] text-faint">
                  {semesterAvg === null ? "미입력" : `평균 ${semesterAvg.toFixed(2)}등급`}
                </span>
              </div>
              <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
                {subjects.map((subject) => (
                  <SubjectRow
                    key={subject.subjectName}
                    subject={subject}
                    levels={levels}
                    value={values[subjectKey(semester, subject.subjectName)]}
                    disabled={isPending}
                    onChange={(value) =>
                      setValues((prev) => setSubjectValue(prev, semester, subjects, subject, value))
                    }
                  />
                ))}
              </ul>
            </section>
          );
        })}
        <GradeTiers activeGrade={rounded} scoreOf={(tier) => toNcsScore(tier, category.maxScore)} />
        {average !== null && rounded !== null && score !== null ? (
          <ScoreSummary
            label={
              <>
                평균 {Number(average.toFixed(2))}등급
                {rounded !== average && <span className="text-faint"> → {rounded}등급 반올림</span>}
              </>
            }
            score={score}
          />
        ) : (
          <p className="text-[12px] leading-[18px] text-soft">
            필수 과목과 택1 과목을 학기마다 모두 입력하면 점수가 계산됩니다.
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" disabled={isPending} onClick={onClose}>
          취소
        </Button>
        <Button disabled={score === null || isPending} onClick={handleSubmit}>
          {isPending ? "제출 중…" : score !== null ? `제출하기 (${score}점)` : "제출하기"}
        </Button>
      </ModalFooter>
    </>
  );
}

type SubjectRowProps = {
  subject: AcademicSubjectRow;
  levels: readonly string[];
  value: string | undefined;
  disabled: boolean;
  onChange: (value: string) => void;
};

function SubjectRow({ subject, levels, value, disabled, onChange }: SubjectRowProps) {
  const tag = subject.electiveGroup !== null ? `택1 · ${subject.electiveGroup}` : subject.optional ? "선택" : null;

  return (
    <li className="flex items-center justify-between gap-3 px-3 py-2">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[13px] leading-[19.5px] text-body">{subject.subjectName}</span>
        {tag && <span className="text-[11px] leading-[16.5px] text-faint">{tag}</span>}
      </div>
      <div role="group" aria-label={`${subject.subjectName} 등급`} className="flex shrink-0 gap-1">
        {levels.map((level) => {
          const selected = level === value;
          return (
            <button
              key={level}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => onChange(level)}
              className={`size-8 rounded-md border text-[12px] leading-[18px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:opacity-50 ${
                selected ? "border-transparent bg-brand text-white" : "border-line bg-surface text-body hover:bg-wash"
              }`}
            >
              {level}
            </button>
          );
        })}
      </div>
    </li>
  );
}
