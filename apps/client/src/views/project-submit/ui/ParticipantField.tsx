import { useEffect, useState, type FocusEvent } from "react";
import { CloseIcon, SearchIcon } from "@repo/ui";
import { matchName, useStudentsQuery, type Student } from "@/entities/member";

type ParticipantFieldProps = {
  labelId: string;
  participants: Student[];
  onChange: (participants: Student[]) => void;
  disabled?: boolean;
};

const SEARCH_DEBOUNCE_MS = 200;

function formatStudentNumber({ grade, classNumber, number }: Student) {
  if (grade === null || classNumber === null) return "";
  return `${grade}학년 ${classNumber}반${number === null ? "" : ` ${number}번`}`;
}

export function ParticipantField({ labelId, participants, onChange, disabled }: ParticipantFieldProps) {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const trimmedKeyword = keyword.trim();
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const { data, isPending, isError } = useStudentsQuery();

  // 입력이 멈춘 뒤에 거른다. 그사이에는 "검색 중…"을 보여 준다.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(trimmedKeyword), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmedKeyword]);
  const searching = isPending || debouncedKeyword !== trimmedKeyword;

  const selectedIds = new Set(participants.map((participant) => participant.id));
  const results =
    data?.filter((student) => !selectedIds.has(student.id) && matchName(student.name, debouncedKeyword)) ?? [];
  const showList = open && trimmedKeyword.length > 0;

  const add = (student: Student) => {
    onChange([...participants, student]);
    setKeyword("");
  };

  const remove = (id: string) => onChange(participants.filter((participant) => participant.id !== id));

  // 목록 안의 버튼으로 포커스가 옮겨 갈 때는 닫지 않는다.
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  };

  return (
    <div className="flex flex-col">
      {participants.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-1.5">
          {participants.map((participant) => (
            <li
              key={participant.id}
              className="flex h-7 items-center gap-1.5 rounded-md bg-wash pr-2 pl-2.5 text-[12px] leading-[18px] font-medium text-strong"
            >
              {participant.name}
              <button
                type="button"
                aria-label={`${participant.name} 빼기`}
                disabled={disabled}
                onClick={() => remove(participant.id)}
                className="rounded text-soft transition-colors hover:text-body disabled:opacity-50"
              >
                <CloseIcon aria-hidden="true" className="size-2.75" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative pt-2" onBlur={handleBlur}>
        <div className="flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3.25 transition-[border-color,box-shadow] duration-200 focus-within:border-brand focus-within:shadow-[inset_0_0_0_1px_var(--brand)]">
          <SearchIcon aria-hidden="true" className="size-3.5 shrink-0 text-soft" />
          <input
            type="search"
            aria-labelledby={labelId}
            placeholder="이름으로 학생 검색..."
            value={keyword}
            disabled={disabled}
            onChange={(event) => {
              setKeyword(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
            className="min-w-0 flex-1 bg-transparent text-base text-strong outline-none placeholder:text-faint md:text-[13px]"
          />
        </div>

        {showList && (
          // 방향키 탐색이 없어 combobox/listbox 대신 버튼 목록으로 둔다. Tab으로 결과를 고를 수 있다.
          <ul
            aria-labelledby={labelId}
            className="absolute inset-x-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-md border border-line bg-surface py-1 shadow-lg"
          >
            {isError ? (
              <li className="px-3.25 py-2 text-[13px] leading-[19.5px] text-danger">학생을 불러오지 못했어요.</li>
            ) : searching ? (
              // 디바운스 중에는 이전 검색어의 결과를 선택하지 못하게 숨긴다.
              <li className="px-3.25 py-2 text-[13px] leading-[19.5px] text-soft">검색 중…</li>
            ) : results.length === 0 ? (
              <li className="px-3.25 py-2 text-[13px] leading-[19.5px] text-soft">검색 결과가 없어요.</li>
            ) : (
              results.map((student) => (
                <li key={student.id}>
                  <button
                    type="button"
                    onClick={() => add(student)}
                    className="flex w-full items-center justify-between gap-3 px-3.25 py-2 text-left text-[13px] leading-[19.5px] text-strong transition-colors hover:bg-wash focus-visible:bg-wash focus-visible:outline-none"
                  >
                    {student.name}
                    <span className="text-[12px] leading-[18px] text-soft">{formatStudentNumber(student)}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {participants.length > 0 && (
        <p className="pt-1.5 text-[12px] leading-[18px] text-soft">{participants.length}명 선택됨</p>
      )}
    </div>
  );
}
