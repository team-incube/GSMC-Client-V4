import { BellIcon } from "../icons/BellIcon";

export function NotificationButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="알림"
      className="flex size-10 shrink-0 items-center justify-center rounded-md text-strong transition-colors duration-200 hover:bg-line"
    >
      <BellIcon className="size-[22px]" />
    </button>
  );
}
