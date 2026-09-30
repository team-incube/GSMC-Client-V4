import Image from "next/image";

export function DataGsmLoginButton() {
  return (
    <button
      type="button"
      className="relative flex h-[48px] w-[300px] items-center justify-center rounded-[6px] border border-[#e2e8f0] bg-[#f8fafc] font-medium text-[14px] text-[#0f172a] transition-colors hover:bg-[#e2e8f0]"
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
