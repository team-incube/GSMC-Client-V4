import Link from "next/link";
import { ScrollLink, ScrollReveal } from "@repo/ui";
import type { ReactNode } from "react";
import {
  AREAS,
  FAQ_PREVIEW,
  HERO_IMAGE,
  INTRO_CARDS,
  INTRO_TAGS,
  METHODS,
  PROCESS_STEPS,
  SCORE_ITEMS,
} from "../model/content";
import { Icon, type IconName } from "./icons";

const CARD = "rounded-xl bg-surface transition-[transform,translate,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/10 motion-reduce:transition-none";

function Section({
  id,
  title,
  tone,
  children,
  contentClassName,
  titleClassName,
}: {
  id?: string;
  title: string;
  tone: "page" | "wash";
  children: ReactNode;
  contentClassName: string;
  titleClassName: string;
}) {
  return (
    <section id={id} className={tone === "wash" ? "bg-wash" : "bg-page"}>
      <div className={`mx-auto w-full max-w-[1200px] px-6 ${contentClassName}`}>
        <h2 className={`flex items-center justify-center text-center text-[32px] leading-[normal] tracking-[-1.28px] font-semibold text-strong ${titleClassName}`}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function IconBadge({ name, size = "md" }: { name: IconName; size?: "sm" | "md" }) {
  const box = size === "md" ? "size-10 rounded-lg" : "size-9 rounded-md";
  const glyph = size === "md" ? "size-[18px]" : "size-4";
  return (
    <span className={`flex items-center justify-center bg-brandwash text-brand ${box}`}>
      <Icon name={name} className={glyph} />
    </span>
  );
}

function Hero() {
  return (
    <section
      className="relative flex h-[520px] items-center justify-center bg-cover bg-center md:h-[800px]"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${HERO_IMAGE}), linear-gradient(135deg, #1e3a8a, #0f172a)`,
      }}
    >
      <h1 data-reveal className="px-6 text-center text-[32px] leading-[38px] font-semibold text-white md:text-[48px] md:leading-[normal] md:tracking-[-2.4px]">
        GSM 인증제란?
      </h1>
      <ScrollLink
        href="#intro"
        aria-label="아래로 스크롤"
        data-reveal
        className="absolute bottom-6 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full text-white/90 transition-transform duration-200 hover:-translate-y-1 hover:text-white motion-reduce:transition-none"
      >
        <Icon name="chevronDown" className="size-6" />
      </ScrollLink>
    </section>
  );
}

function Intro() {
  return (
    <section id="intro" className="bg-page">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
        <h2 data-reveal className="mb-12 flex h-16 items-center justify-center text-center text-[32px] leading-[normal] tracking-[-1.28px] font-semibold text-strong">
          프로그램 소개
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {INTRO_CARDS.map((card, i) => (
            <article data-reveal data-reveal-delay={i * 80} key={card.title} className={`${CARD} flex min-h-[205px] flex-col p-6`}>
              <span className="text-[12px] leading-[14px] font-medium tracking-[0.96px] text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-[20px] leading-[30px] font-semibold tracking-[-0.4px] text-strong">{card.title}</h3>
              <p className="mt-1 text-[14px] leading-6 text-body">{card.description}</p>
            </article>
          ))}
        </div>
        <ul className="mt-5 flex flex-wrap gap-2">
          {INTRO_TAGS.map((tag) => (
            <li
              key={tag}
              data-reveal
              className="flex h-7 items-center rounded-full border border-line bg-surface px-[13px] text-[12px] leading-[18px] font-medium tracking-[0.96px] text-soft transition-colors duration-150 hover:border-brand hover:text-brand motion-reduce:transition-none"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Areas() {
  return (
    <Section title="평가영역" tone="wash" contentClassName="pt-20 pb-24" titleClassName="mb-12 h-16">
      <div className="grid gap-4 md:grid-cols-3">
        {AREAS.map((area, i) => (
          <article data-reveal data-reveal-delay={i * 80} key={area.title} className={`${CARD} flex min-h-[165px] flex-col p-6 md:h-[165px]`}>
            <IconBadge name={area.icon} />
            <div className="mt-4 flex flex-col gap-1">
              <h3 className="text-[18px] leading-[27px] font-semibold tracking-[-0.36px] text-strong">{area.title}</h3>
              <p className="text-[14px] leading-5 text-body">{area.description}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Methods() {
  return (
    <Section title="운영방식" tone="page" contentClassName="py-24" titleClassName="mb-16 h-16">
      <div className="grid gap-6 md:grid-cols-3">
        {METHODS.map((method, i) => (
          <article data-reveal data-reveal-delay={i * 80} key={method.title} className={`${CARD} flex min-h-[186.5px] flex-col p-6 md:h-[186.5px]`}>
            <IconBadge name={method.icon} />
            <div className="mt-4 flex flex-col">
              <h3 className="text-[19px] leading-[28.5px] font-semibold tracking-[-0.38px] text-strong">{method.title}</h3>
              <p className="mt-1.5 text-[14px] leading-5 text-body">{method.description}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function ScoreItems() {
  return (
    <Section title="인증제는 이렇게 평가됩니다" tone="wash" contentClassName="py-24" titleClassName="mb-16 h-[54px]">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SCORE_ITEMS.map((item, i) => (
          <li data-reveal data-reveal-delay={Math.min(i * 45, 270)} key={item.title} className={`${CARD} flex min-h-[134px] flex-col p-5 md:h-[134px]`}>
            <div className="flex h-9 items-center justify-between">
              <IconBadge name={item.icon} size="sm" />
              <span className="rounded-full border border-line bg-wash px-[7px] py-[3px] text-[9px] leading-[13.5px] font-medium text-soft">
                최대 {item.maxScore}점
              </span>
            </div>
            <h3 className="flex h-9 items-center text-[13px] leading-5 font-semibold text-strong">{item.title}</h3>
            <p className="text-[11px] leading-4 text-soft">{item.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Process() {
  return (
    <Section title="운영방식" tone="page" contentClassName="py-24" titleClassName="mb-16 h-[54px]">
      <ol className="grid gap-x-4 gap-y-[40.5px] md:min-h-[345px] md:grid-cols-2">
        {PROCESS_STEPS.map((step, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <li data-reveal data-reveal-delay={(i % 2) * 80} key={step.title} className={`${CARD} relative flex min-h-[140px] flex-col overflow-hidden p-6 md:h-[140px]`}>
              <span className="text-[12px] leading-[14px] font-medium tracking-[0.96px] text-brand">{num}</span>
              <h3 className="mt-3 text-[20px] leading-[30px] font-semibold tracking-[-0.4px] text-strong">{step.title}</h3>
              <p className="mt-1 text-[14px] leading-5 text-body">{step.description}</p>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 select-none text-[96px] leading-[96px] font-bold text-line"
              >
                {num}
              </span>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

function FaqPreview() {
  return (
    <section className="bg-wash">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-24">
        <div className="mb-12 flex h-20 items-start justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-[12px] leading-4 font-medium tracking-[0.96px] text-soft">FAQ</span>
            <h2 data-reveal className="flex h-16 items-center text-[32px] leading-[normal] tracking-[-1.28px] font-semibold text-strong">
              자주 묻는 질문
            </h2>
          </div>
          <Link
            href="/faq"
            data-reveal
            className="inline-flex h-9 self-end items-center gap-1.5 rounded-md border border-line bg-surface px-[17px] text-[13px] leading-[19.5px] font-medium text-soft transition-colors duration-150 hover:border-brand hover:text-brand motion-reduce:transition-none"
          >
            전체 보기
            <Icon name="arrowRight" className="size-3" />
          </Link>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {FAQ_PREVIEW.map((faq, i) => (
            <li data-reveal data-reveal-delay={(i % 2) * 80} key={faq.id} className={`${CARD} flex min-h-[162px] flex-col p-6 md:h-[162px]`}>
              <span className="flex h-9 items-center">
                <span className="rounded-[4px] border border-line bg-wash px-[6px] py-[2px] text-[9px] leading-[13.5px] font-medium text-soft">
                  {faq.category}
                </span>
              </span>
              <h3 className="flex h-6 items-center text-[16px] leading-6 font-semibold tracking-[-0.4px] text-strong">{faq.question}</h3>
              <p className="h-[52px] line-clamp-2 pt-3 text-[14px] leading-5 text-body">{faq.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CertificationPage() {
  return (
    <main>
      <ScrollReveal>
        <Hero />
        <Intro />
        <Areas />
        <Methods />
        <ScoreItems />
        <Process />
        <FaqPreview />
      </ScrollReveal>
    </main>
  );
}