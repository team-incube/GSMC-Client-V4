import type { ChangeEvent } from "react";
import { toast } from "sonner";
import { CloseIcon, UploadIcon } from "@repo/ui";
import { MAX_FILE_SIZE_BYTES } from "@/entities/file";

type FileFieldProps = {
  placeholder: string;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
};

export function FileField({ placeholder, file, onChange, disabled }: FileFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    // 같은 파일을 다시 고를 때도 change가 일어나도록 비운다.
    event.target.value = "";
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      toast.error("20MB 이하의 파일만 첨부할 수 있습니다.");
      return;
    }
    onChange(selected);
  };

  if (file) {
    return (
      <div className="flex w-full items-center gap-2 rounded-md bg-wash px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate text-[13px] leading-[19.5px] text-body">{file.name}</span>
        <button
          type="button"
          aria-label={`${file.name} 첨부 취소`}
          disabled={disabled}
          onClick={() => onChange(null)}
          className="shrink-0 rounded text-soft transition-colors hover:text-body disabled:opacity-50"
        >
          <CloseIcon aria-hidden="true" className="size-3.25" />
        </button>
      </div>
    );
  }

  return (
    <label
      className={`flex h-[42px] w-full items-center gap-2 rounded-md border border-dashed border-line px-3.25 text-[13px] leading-[19.5px] text-soft transition-colors focus-within:border-brand ${
        disabled ? "opacity-50" : "cursor-pointer hover:bg-wash"
      }`}
    >
      <UploadIcon aria-hidden="true" className="size-3.25 shrink-0" />
      {placeholder}
      <input type="file" accept="image/*,.pdf" disabled={disabled} onChange={handleChange} className="sr-only" />
    </label>
  );
}
