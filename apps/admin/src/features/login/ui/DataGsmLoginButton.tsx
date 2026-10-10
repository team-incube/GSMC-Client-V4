import Image from "next/image";

export function DataGsmLoginButton() {
  return (
    <button
      type="button"
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
