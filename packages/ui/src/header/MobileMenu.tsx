"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CloseIcon } from "../icons/CloseIcon";
import { MenuIcon } from "../icons/MenuIcon";
import { LogoutButton } from "./LogoutButton";
import { NavLink } from "./NavLink";

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
      if (event.key === "Escape") setIsOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
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
