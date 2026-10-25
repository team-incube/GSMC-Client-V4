import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      <header className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6">
        <h2 className="text-[11px] leading-[16.5px] font-medium tracking-[0.88px] text-soft uppercase">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

type SectionMessageProps = {
  message: string;
  onRetry?: () => void;
};

export function SectionMessage({ message, onRetry }: SectionMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10">
      <p className="text-[14px] text-soft">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="h-8 rounded-md border border-line bg-surface px-3 text-[12px] font-medium text-body transition-colors duration-200 hover:bg-wash"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
