export function LogoutButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-body-1 font-semibold flex h-10 shrink-0 items-center justify-center rounded-md px-3 text-body transition-colors duration-200 hover:bg-line"
    >
      로그아웃
    </button>
  );
}
