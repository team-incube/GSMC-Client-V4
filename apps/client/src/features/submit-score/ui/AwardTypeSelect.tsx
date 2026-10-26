import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDownIcon } from "@repo/ui";
import { AWARD_TYPES, type AwardType } from "../model/constants";

type AwardTypeSelectProps = {
  value: AwardType;
  onChange: (value: AwardType) => void;
  disabled?: boolean;
};

export function AwardTypeSelect({ value, onChange, disabled }: AwardTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const openList = () => {
    setActiveIndex(AWARD_TYPES.indexOf(value));
    setOpen(true);
  };

  const select = (index: number) => {
    onChange(AWARD_TYPES[index]);
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
      setActiveIndex((index) => Math.min(index + 1, AWARD_TYPES.length - 1));
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
        <span className="truncate">{value}</span>
        <ChevronDownIcon
          aria-hidden="true"
          className={`size-3.5 shrink-0 text-soft transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="대회 종류"
          className="absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden rounded-md border border-line bg-surface py-1 shadow-lg"
        >
          {AWARD_TYPES.map((type, index) => (
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
              {type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
