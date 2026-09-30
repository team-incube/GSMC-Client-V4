export function LogoutButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-button flex h-10 shrink-0 items-center justify-center rounded-md bg-surface px-[13px] text-strong transition-colors duration-200 hover:bg-line"
    >
      로그아웃
    </button>
  );
}
