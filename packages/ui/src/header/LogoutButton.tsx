export function LogoutButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-button flex h-9 shrink-0 items-center justify-center rounded-md border border-line bg-surface px-[13px] text-strong"
    >
      로그아웃
    </button>
  );
}
