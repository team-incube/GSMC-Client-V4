import type { ComponentPropsWithRef } from "react";
import { BellIcon } from "../icons/BellIcon";

type NotificationButtonProps = {
  hasUnread?: boolean;
} & ComponentPropsWithRef<"button">;

export function NotificationButton({ hasUnread = false, className, ...props }: NotificationButtonProps) {
  return (
    <button
      type="button"
      aria-label={hasUnread ? "알림, 읽지 않은 알림 있음" : "알림"}
      className={`relative flex size-10 shrink-0 items-center justify-center rounded-md text-strong transition-colors duration-200 hover:bg-line ${className ?? ""}`}
      {...props}
    >
      <BellIcon className="size-5" />
      {hasUnread && (
        <span aria-hidden className="absolute top-2 right-2 size-2 rounded-full bg-danger ring-2 ring-page" />
      )}
    </button>
  );
}
