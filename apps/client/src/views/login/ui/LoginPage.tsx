import Image from "next/image";
import { DataGsmLoginButton } from "@/features/login";

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-[60px] sm:gap-20 lg:gap-[100px]">
        <Image
          src="/logo-vertical.svg"
          alt="GSMC"
          width={260}
          height={247}
          priority
          className="h-auto w-[120px] sm:w-[200px] lg:w-[260px]"
        />
        <DataGsmLoginButton />
      </div>
    </main>
  );
}
