"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrashIcon } from "../icons/TrashIcon";
import { NotificationButton } from "./NotificationButton";

type NotificationTone = "default" | "brand" | "danger";

export type NotificationItem = {
  id: string;
  label: string;
  tone: NotificationTone;
  content: string;
  isRead: boolean;
  time: string;
  // 있으면 알림을 눌러 이 주소로 이동한다.
  href?: string;
};

export type NotificationMenuProps = {
  items: NotificationItem[];
  hasUnread: boolean;
  status: "pending" | "error" | "success";
  hasMore: boolean;
  isLoadingMore: boolean;
  onOpen?: () => void;
  onLoadMore?: () => void;
  onDelete?: (id: string) => void;
  onRetry?: () => void;
};

const TONE_CLASSES: Record<NotificationTone, string> = {
  default: "text-soft",
  brand: "text-brand",
  danger: "text-danger",
};

export function NotificationMenu({
  items,
  hasUnread,
  status,
  hasMore,
  isLoadingMore,
  onOpen,
  onLoadMore,
  onDelete,
  onRetry,
}: NotificationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  // 열 때 안 읽었던 알림. 열자마자 읽음 처리되어도 이번에 열려 있는 동안은 새 알림으로 표시한다.
  const [newIds, setNewIds] = useState<ReadonlySet<string>>(new Set());
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggle = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setNewIds(new Set(items.filter((item) => !item.isRead).map((item) => item.id)));
    setIsOpen(true);
    onOpen?.();
  };

  return (
    <div ref={rootRef} className="sm:relative">
      <NotificationButton
        ref={buttonRef}
        hasUnread={hasUnread}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-haspopup="dialog"
      />

      <div
        id={panelId}
        role="dialog"
        aria-label="알림"
        hidden={!isOpen}
        className="fixed inset-x-4 top-16 z-50 flex max-h-[min(480px,calc(100dvh-80px))] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-xl sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-90"
      >
        <div className="flex h-12 shrink-0 items-center border-b border-line px-4">
          <h2 className="text-[14px] leading-[21px] font-semibold text-strong">알림</h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {status === "pending" ? (
            <ul aria-hidden className="flex flex-col">
              {Array.from({ length: 3 }, (_, index) => (
                <li key={index} className="flex flex-col gap-2 border-b border-linesoft px-4 py-3.5 last:border-b-0">
                  <span className="h-3 w-12 animate-pulse rounded bg-wash" />
                  <span className="h-3.5 w-4/5 animate-pulse rounded bg-wash" />
                </li>
              ))}
            </ul>
          ) : status === "error" ? (
            <p className="flex flex-col items-center gap-2 px-4 py-10 text-[13px] leading-[19.5px] text-soft">
              알림을 불러오지 못했어요.
              <button
                type="button"
                onClick={onRetry}
                className="rounded font-medium text-brand hover:underline focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              >
                다시 시도
              </button>
            </p>
          ) : items.length === 0 ? (
            <p className="px-4 py-10 text-center text-[13px] leading-[19.5px] text-soft">알림이 없어요.</p>
          ) : (
            <ul className="flex flex-col">
              {items.map((item) => {
                const isNew = !item.isRead || newIds.has(item.id);
                return (
                  <li
                    key={item.id}
                    className={`group flex items-start gap-3 border-b border-linesoft px-4 py-3.5 last:border-b-0 ${
                      isNew ? "bg-brandwash" : ""
                    }`}
                  >
                    <NotificationContent href={item.href} onNavigate={() => setIsOpen(false)}>
                      <div className="flex items-center gap-1.5 text-[11px] leading-[16.5px]">
                        {isNew && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-brand" />}
                        <span className={`font-semibold ${TONE_CLASSES[item.tone]}`}>{item.label}</span>
                        <span className="text-faint">· {item.time}</span>
                        {isNew && <span className="sr-only">(새 알림)</span>}
                      </div>
                      <p className="text-[13px] leading-[19.5px] break-keep whitespace-pre-wrap text-body">
                        {item.content}
                      </p>
                    </NotificationContent>
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        aria-label={`${item.label} 알림 삭제`}
                        className="flex size-7 shrink-0 items-center justify-center rounded-md text-faint transition-colors duration-200 hover:bg-wash hover:text-danger focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                      >
                        <TrashIcon aria-hidden className="size-3.5" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {status === "success" && hasMore && (
          <div className="shrink-0 border-t border-line p-2">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="h-9 w-full rounded-md text-[13px] leading-[19.5px] font-medium text-body transition-colors duration-200 hover:bg-wash focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:opacity-50"
            >
              {isLoadingMore ? "불러오는 중..." : "더 보기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type NotificationContentProps = {
  href?: string;
  onNavigate: () => void;
  children: ReactNode;
};

const CONTENT_CLASS = "flex min-w-0 flex-1 flex-col gap-1";

function NotificationContent({ href, onNavigate, children }: NotificationContentProps) {
  if (!href) return <div className={CONTENT_CLASS}>{children}</div>;
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`${CONTENT_CLASS} rounded-md group-hover:[&_p]:text-strong focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none`}
    >
      {children}
    </Link>
  );
}
