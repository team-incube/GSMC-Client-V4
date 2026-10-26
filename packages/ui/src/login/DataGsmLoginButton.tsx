"use client";

import { useEffect, useState } from "react";
import { DataGsmIcon } from "../icons/DataGsmIcon";

type DataGsmLoginButtonProps = {
  onLogin: () => Promise<void>;
  onError: (error: unknown) => void;
};

export function DataGsmLoginButton({ onLogin, onError }: DataGsmLoginButtonProps) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setPending(false);
    };

    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  async function handleClick() {
    setPending(true);
    try {
      await onLogin();
    } catch (error) {
      onError(error);
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="relative flex h-[48px] w-[300px] items-center justify-center rounded-[6px] border border-line bg-surface font-medium text-[14px] text-strong transition-colors hover:bg-wash disabled:cursor-not-allowed disabled:opacity-60"
    >
      <DataGsmIcon className="absolute left-[20px] size-[14px]" />
      DataGSM으로 계속하기
    </button>
  );
}
