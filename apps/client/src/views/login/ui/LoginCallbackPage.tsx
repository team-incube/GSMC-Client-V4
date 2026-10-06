"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { parseDataGsmCallback } from "@/features/login";

const ERROR_MESSAGES = {
  denied: "DataGSM 로그인이 취소되었거나 실패했습니다.",
  "invalid-state": "인증 요청을 확인할 수 없습니다. 다시 시도해주세요.",
  "missing-code": "인증 코드를 받지 못했습니다. 다시 시도해주세요.",
} as const;

export function LoginCallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const result = parseDataGsmCallback(window.location.search);
    if (result.ok) {
      router.replace("/");
      return;
    }

    router.replace("/login");
    // Toaster subscribes in its own effect, which runs after this one on a full page load
    setTimeout(() => toast.error(ERROR_MESSAGES[result.reason]), 0);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-6">
      <p className="text-[14px] text-body">DataGSM 인증 정보를 확인하고 있어요...</p>
    </main>
  );
}
