"use client";

import { toast } from "sonner";
import { startDataGsmLogin } from "@repo/lib";
import { DataGsmLoginButton } from "@repo/ui";

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-[60px] sm:gap-20 lg:gap-[100px]">
        <img
          src="/logo-stacked.svg"
          alt="GSMC"
          className="h-auto w-30 sm:w-45 lg:w-65"
        />
        <DataGsmLoginButton
          onLogin={startDataGsmLogin}
          onError={(error) =>
            toast.error(error instanceof Error ? error.message : "로그인에 실패했습니다.")
          }
        />
      </div>
    </main>
  );
}
