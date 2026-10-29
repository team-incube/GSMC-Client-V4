import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronDownIcon } from "@repo/ui";
import {
  AWARD_COMPETITION_TYPES,
  AWARD_COMPETITION_TYPE_LABEL,
  type AwardCompetitionType,
} from "@/entities/certification";

// 목록과 버튼 사이 간격(mt-1)과 목록 최대 높이
const LIST_GAP = 4;
const LIST_MAX_HEIGHT = 280;

// 모달 본문은 넘치는 부분을 잘라내므로, 목록은 body에 띄우고 버튼 위치에 맞춰 고정한다.
// 아래 공간이 모자라면 위로 펼친다.
function getListStyle(button: HTMLElement): CSSProperties {
  const rect = button.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - LIST_GAP;
  const openUp = spaceBelow < LIST_MAX_HEIGHT && rect.top > spaceBelow;
  return {
    left: rect.left,
    width: rect.width,
    maxHeight: Math.min(LIST_MAX_HEIGHT, (openUp ? rect.top : spaceBelow) - LIST_GAP),
    ...(openUp ? { bottom: window.innerHeight - rect.top + LIST_GAP } : { top: rect.bottom + LIST_GAP }),
  };
}

type AwardTypeSelectProps = {
  value: AwardCompetitionType;
  onChange: (value: AwardCompetitionType) => void;
  disabled?: boolean;
};

export function AwardTypeSelect({ value, onChange, disabled }: AwardTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [listStyle, setListStyle] = useState<CSSProperties>();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useLayoutEffect(() => {
    if (!open) return;
    const updatePosition = () => buttonRef.current && setListStyle(getListStyle(buttonRef.current));
    updatePosition();
    // 모달 본문이 스크롤되거나 창 크기가 바뀌면 버튼을 따라간다.
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !listRef.current?.contains(target)) setOpen(false);
    };
    // 모달(Radix)은 document 캡처 단계에서 Esc를 받아 버튼의 onKeyDown보다 먼저 닫힌다.
    // window 캡처 단계에서 먼저 막아 목록만 닫는다.
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape, true);
    };
  }, [open]);

  const openList = () => {
    setActiveIndex(AWARD_COMPETITION_TYPES.indexOf(value));
    setOpen(true);
  };

  const select = (index: number) => {
    onChange(AWARD_COMPETITION_TYPES[index]);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, AWARD_COMPETITION_TYPES.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(activeIndex);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-label="대회 종류"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-surface px-3.25 text-left text-[13px] leading-[19.5px] text-strong transition-[border-color,box-shadow] duration-200 focus-visible:border-brand focus-visible:shadow-[inset_0_0_0_1px_var(--brand)] focus-visible:outline-none disabled:opacity-50 ${
          open ? "border-brand" : "border-line"
        }`}
      >
        <span className="truncate">{AWARD_COMPETITION_TYPE_LABEL[value]}</span>
        <ChevronDownIcon
          aria-hidden="true"
          className={`size-3.5 shrink-0 text-soft transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open &&
        listStyle &&
        createPortal(
          // 모달이 열려 있으면 body의 포인터 이벤트가 꺼지므로 목록에서 다시 켠다.
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="대회 종류"
            style={listStyle}
            className="pointer-events-auto fixed z-50 overflow-y-auto rounded-md border border-line bg-surface py-1 shadow-lg"
          >
            {AWARD_COMPETITION_TYPES.map((type, index) => (
              <li
                key={type}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={type === value}
                // 버튼의 포커스를 유지해 키보드 조작이 이어지게 한다.
                onPointerDown={(event) => event.preventDefault()}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => select(index)}
                className={`cursor-pointer px-3.25 py-2 text-[13px] leading-[19.5px] ${
                  type === value ? "font-semibold text-strong" : "text-body"
                } ${index === activeIndex ? "bg-wash" : ""}`}
              >
                {AWARD_COMPETITION_TYPE_LABEL[type]}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
