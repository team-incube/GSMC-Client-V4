import { TrashIcon } from "@repo/ui";

export type EntryListItem = {
  id: string;
  title: string;
  description: string;
  points?: number;
};

type EntryListProps = {
  items: EntryListItem[];
  onRemove: (id: string) => void;
  disabled?: boolean;
};

export function EntryList({ items, onRemove, disabled }: EntryListProps) {
  return (
    <ul className="flex flex-col gap-2 border-b border-line px-6 py-4">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 rounded-lg bg-wash px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] leading-[19.5px] font-medium text-strong">{item.title}</p>
            <p className="truncate pt-0.5 text-[11px] leading-[16.5px] tracking-[0.08em] text-faint">
              {item.description}
            </p>
          </div>
          {item.points != null && (
            <span className="shrink-0 text-[11px] leading-[16.5px] text-soft">+{item.points}점</span>
          )}
          <button
            type="button"
            aria-label={`${item.title} 삭제`}
            disabled={disabled}
            onClick={() => onRemove(item.id)}
            className="shrink-0 rounded text-soft transition-colors hover:text-danger disabled:opacity-50"
          >
            <TrashIcon aria-hidden="true" className="size-3.25" />
          </button>
        </li>
      ))}
    </ul>
  );
}
