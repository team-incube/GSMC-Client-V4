"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { HTMLAttributes, ReactNode } from "react";
import { CloseIcon } from "../icons/CloseIcon";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export function Modal({ open, onOpenChange, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-scrim" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-4rem)] w-[448px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-xl"
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type ModalHeaderProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  metaSub?: ReactNode;
};

export function ModalHeader({ title, eyebrow, subtitle, meta, metaSub }: ModalHeaderProps) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 py-5">
      <div className="flex flex-col gap-1">
        {eyebrow && <span className="text-[12px] leading-[17px] text-faint">{eyebrow}</span>}
        <Dialog.Title className="text-[16px] leading-6 font-semibold text-strong">
          {title}
        </Dialog.Title>
        {subtitle && <span className="text-[12px] leading-[18px] text-soft">{subtitle}</span>}
      </div>

      <div className="flex shrink-0 items-start gap-3">
        {(meta || metaSub) && (
          <div className="flex flex-col items-end gap-0.5 text-right">
            {meta && <span className="text-[13px] leading-[18px] text-body">{meta}</span>}
            {metaSub && <span className="text-[12px] leading-[17px] text-faint">{metaSub}</span>}
          </div>
        )}
        <Dialog.Close
          aria-label="닫기"
          className="-mr-1.5 flex size-8 items-center justify-center rounded-md text-faint transition-colors hover:bg-wash hover:text-body focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          <CloseIcon className="size-[18px]" />
        </Dialog.Close>
      </div>
    </div>
  );
}

type ModalBodyProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function ModalBody({ children, className, ...props }: ModalBodyProps) {
  return (
    <div className={`flex-1 overflow-y-auto px-6 py-5 ${className ?? ""}`} {...props}>
      {children}
    </div>
  );
}

type ModalFooterProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function ModalFooter({ children, className, ...props }: ModalFooterProps) {
  return (
    <div
      className={`flex shrink-0 gap-2 border-t border-line px-6 py-4 [&>*]:flex-1 ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
