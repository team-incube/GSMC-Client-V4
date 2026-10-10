"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { startDataGsmLogin } from "../model/dataGsmLogin";

export function DataGsmLoginButton() {
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
      await startDataGsmLogin();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "로그인에 실패했습니다.");
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
      <Image
        src="/datagsm-d.svg"
        alt=""
        width={14}
        height={14}
        className="absolute left-[20px]"
      />
      DataGSM으로 계속하기
    </button>
  );
}
