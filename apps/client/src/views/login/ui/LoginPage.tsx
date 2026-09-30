import { LogoMarkIcon, LogoWordmarkIcon } from "@repo/ui";
import { DataGsmLoginButton } from "@/features/login";

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-[60px] sm:gap-20 lg:gap-[100px]">
        <div
          role="img"
          aria-label="GSMC"
          className="flex flex-col items-center gap-4 text-brand sm:gap-6 lg:gap-8"
        >
          <LogoMarkIcon className="h-auto w-[100px] sm:w-[170px] lg:w-[220px]" />
          <LogoWordmarkIcon className="h-auto w-[110px] sm:w-[180px] lg:w-[240px]" />
        </div>
        <DataGsmLoginButton />
      </div>
    </main>
  );
}
