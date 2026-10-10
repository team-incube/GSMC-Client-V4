"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { completeDataGsmLogin } from "@/features/login";

export function LoginCallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    completeDataGsmLogin(window.location.search).then((result) => {
      if (result.ok) {
        router.replace("/");
        return;
      }
      toast.error(result.message);
      router.replace("/login");
    });
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-6">
      <p className="text-[14px] text-body">DataGSM 인증 정보를 확인하고 있어요...</p>
    </main>
  );
}
