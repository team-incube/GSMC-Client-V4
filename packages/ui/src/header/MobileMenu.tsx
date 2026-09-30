"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CloseIcon } from "../icons/CloseIcon";
import { MenuIcon } from "../icons/MenuIcon";
import { LogoutButton } from "./LogoutButton";
import { NavLink } from "./NavLink";

// Tailwind md 브레이크포인트. 이 폭부터는 데스크톱 헤더가 보이고 이 메뉴는 숨겨진다.
const DESKTOP_QUERY = "(min-width: 48rem)";

const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])';

type MobileMenuProps = {
  items: { label: string; href: string }[];
  onLogout?: () => void;
};

export function MobileMenu({ items, onLogout }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) openButtonRef.current?.focus();
      wasOpenRef.current = false;
      return;
    }
    wasOpenRef.current = true;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      // 포커스가 패널 밖으로 나가지 않도록 처음과 끝에서 순환시킨다.
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isInside = panelRef.current.contains(active);

      if (event.shiftKey && (active === first || !isInside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !isInside)) {
        event.preventDefault();
        first.focus();
      }
    };

    // 메뉴가 열린 채 데스크톱 폭이 되면 CSS로만 숨겨져 스크롤 잠금이 남으므로 닫는다.
    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const handleDesktopChange = () => {
      if (desktopQuery.matches) setIsOpen(false);
    };
    handleDesktopChange();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleDesktopChange);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="메뉴 열기"
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex size-10 shrink-0 items-center justify-center rounded-md text-strong transition-colors duration-200 hover:bg-line"
      >
        <MenuIcon className="size-5" />
      </button>

      <div
        aria-hidden
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
        inert={!isOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col border-l border-line bg-page shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-end px-4">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="메뉴 닫기"
            className="flex size-10 shrink-0 items-center justify-center rounded-md text-strong transition-colors duration-200 hover:bg-line"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-4">
          {items.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} className="w-full" />
          ))}
        </nav>
        <div className="mx-4 mt-3 border-t border-line pt-3">
          <LogoutButton onClick={onLogout} />
        </div>
      </div>
    </div>
  );
}
