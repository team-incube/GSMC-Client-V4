"use client";

import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "@repo/ui";
import { CLASS_OPTIONS, GRADE_OPTIONS, type StudentListFilter } from "../model/filter";

type StudentFilterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter: StudentListFilter;
  onFilterChange: (filter: StudentListFilter) => void;
  onReset: () => void;
};

export function StudentFilterModal({ open, onOpenChange, filter, onFilterChange, onReset }: StudentFilterModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm">
      <ModalHeader title="필터" />
      <ModalBody className="flex flex-col gap-5">
        <ChipGroup
          label="학년"
          options={GRADE_OPTIONS}
          unit="학년"
          value={filter.grade}
          onChange={(grade) => onFilterChange({ ...filter, grade })}
        />
        <ChipGroup
          label="반"
          options={CLASS_OPTIONS}
          unit="반"
          value={filter.classNumber}
          onChange={(classNumber) => onFilterChange({ ...filter, classNumber })}
        />
        <Input
          label="이름"
          placeholder="이름 검색"
          value={filter.name}
          onChange={(event) => onFilterChange({ ...filter, name: event.target.value })}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onReset}>
          초기화
        </Button>
        <Button onClick={() => onOpenChange(false)}>닫기</Button>
      </ModalFooter>
    </Modal>
  );
}

type ChipGroupProps = {
  label: string;
  options: readonly number[];
  unit: string;
  value: number | null;
  onChange: (value: number | null) => void;
};

// 한 번 더 누르면 선택이 풀리는 단일 선택 칩 목록
function ChipGroup({ label, options, unit, value, onChange }: ChipGroupProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-3">
      <span className="text-[11px] leading-[16.5px] font-medium tracking-[0.08em] text-soft uppercase">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : option)}
              className={`h-8 rounded-md border px-4 text-[13px] leading-[19.5px] font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${
                selected ? "border-brand bg-brand text-white" : "border-line bg-surface text-body hover:bg-wash"
              }`}
            >
              {option}
              {unit}
            </button>
          );
        })}
      </div>
    </div>
  );
}
