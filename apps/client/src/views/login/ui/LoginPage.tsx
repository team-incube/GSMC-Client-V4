import { LogoIcon } from "@repo/ui";
import { DataGsmLoginButton } from "@/features/login";

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-[60px] sm:gap-20 lg:gap-[100px]">
        <LogoIcon
          role="img"
          aria-label="GSMC"
          className="h-auto w-[220px] text-brand sm:w-[320px] lg:w-[400px]"
        />
        <DataGsmLoginButton />
      </div>
    </main>
  );
}
