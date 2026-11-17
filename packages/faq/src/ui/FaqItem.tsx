import { useId } from "react";
import type { Faq } from "../model/faqs";

type FaqItemProps = {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
};

export function FaqItem({ faq, open, onToggle }: FaqItemProps) {
  const answerId = useId();

  return (
    <li className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={answerId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
      >
        <span className="flex flex-col">
          <span className="text-[10px] leading-3.75 font-medium text-soft">{faq.category}</span>
          <span className="pt-1 text-[15px] leading-6 font-medium text-strong">{faq.question}</span>
        </span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={`size-4 shrink-0 text-soft transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        id={answerId}
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="pb-5 text-[14px] leading-6 text-body">{faq.answer}</p>
        </div>
      </div>
    </li>
  );
}
