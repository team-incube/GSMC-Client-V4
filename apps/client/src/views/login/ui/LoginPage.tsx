import { DataGsmLoginButton } from "@/features/login";

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-[60px] sm:gap-20 lg:gap-[100px]">
        <img
          src="/logo-stacked.svg"
          alt="GSMC"
          className="h-auto w-55 sm:w-80 lg:w-100"
        />
        <DataGsmLoginButton />
      </div>
    </main>
  );
}
