import { BellIcon } from "../icons/BellIcon";

export function NotificationButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="알림"
      className="flex size-9 shrink-0 items-center justify-center rounded-md text-soft transition-colors hover:bg-wash hover:text-strong"
    >
      <BellIcon className="size-4" />
    </button>
  );
}
