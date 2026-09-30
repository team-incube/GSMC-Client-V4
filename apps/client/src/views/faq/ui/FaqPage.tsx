"use client";

import { useState } from "react";
import { FAQS, FAQ_CATEGORIES, type FaqCategory } from "../model/faqs";
import { FaqItem } from "./FaqItem";

type CategoryFilter = "전체" | FaqCategory;

const FILTERS: CategoryFilter[] = ["전체", ...FAQ_CATEGORIES];

export function FaqPage() {
  const [category, setCategory] = useState<CategoryFilter>("전체");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const keyword = query.trim().toLowerCase();
  const visibleFaqs = FAQS.filter(
    (faq) =>
      (category === "전체" || faq.category === category) &&
      (keyword === "" ||
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword)),
  );

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="border-b border-line pb-10">
        <h1 className="text-[32px] leading-12 font-semibold tracking-[-0.04em] text-strong">
          자주 묻는 질문
        </h1>
        <p className="pt-2 text-[15px] leading-[22.5px] text-body">
          인증제 이용 중 자주 묻는 질문을 확인하세요.
        </p>
      </header>

      <div className="pt-10">
        <label className="flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3.25 transition-[border-color,box-shadow] duration-200 focus-within:border-brand focus-within:shadow-[inset_0_0_0_1px_var(--brand)]">
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className="size-3.5 shrink-0 text-soft">
            <path
              d="M12.25 12.25L9.71833 9.71833"
              stroke="currentColor"
              strokeWidth="1.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.41667 11.0833C8.994 11.0833 11.0833 8.994 11.0833 6.41667C11.0833 3.83934 8.994 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.994 3.83934 11.0833 6.41667 11.0833Z"
              stroke="currentColor"
              strokeWidth="1.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="질문 검색..."
            aria-label="질문 검색"
            className="w-full bg-transparent text-[13px] text-body outline-none placeholder:text-faint"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pt-4 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((filter) => {
            const selected = filter === category;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setCategory(filter);
                  setOpenId(null);
                }}
                className={`h-9 shrink-0 cursor-pointer rounded-full px-4 text-[13px] leading-[19.5px] font-medium whitespace-nowrap ${
                  selected ? "bg-brand text-white" : "border border-line bg-surface text-strong"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-10">
        {visibleFaqs.length > 0 ? (
          <ul className="border-t border-line">
            {visibleFaqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                open={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </ul>
        ) : (
          <p className="border-t border-line py-10 text-center text-[14px] text-soft">
            일치하는 질문이 없습니다.
          </p>
        )}
      </div>
    </main>
  );
}
