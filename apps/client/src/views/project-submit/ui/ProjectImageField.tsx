import { useRef, type ChangeEvent } from "react";
import { toast } from "sonner";
import { CloseIcon, UploadIcon } from "@repo/ui";
import { MAX_FILE_SIZE_BYTES } from "@/entities/file";
import { compressImage } from "../lib/compressImage";

export type ProjectImage = {
  file: File;
  previewUrl: string;
};

type ProjectImageFieldProps = {
  image: ProjectImage | null;
  onChange: (image: ProjectImage | null) => void;
  disabled?: boolean;
};

export function ProjectImageField({ image, onChange, disabled }: ProjectImageFieldProps) {
  // 압축·읽기가 비동기라 먼저 고른 파일이 나중에 끝날 수 있다. 마지막 선택만 반영한다.
  const latestSelection = useRef(0);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const original = event.target.files?.[0];
    // 같은 파일을 다시 고를 때도 change가 일어나도록 비운다.
    event.target.value = "";
    if (!original) return;
    const selection = ++latestSelection.current;
    const isLatest = () => selection === latestSelection.current;
    if (!original.type.startsWith("image/")) {
      toast.error("이미지 파일만 첨부할 수 있습니다.");
      return;
    }
    // 고를 때 미리 압축해 두어 제출할 때는 업로드만 하게 한다. 용량 제한도 압축된 크기로 판단한다.
    const selected = await compressImage(original);
    if (!isLatest()) return;
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      toast.error("20MB 이하의 파일만 첨부할 수 있습니다.");
      return;
    }
    // data URL은 해제할 필요가 없어 미리보기 정리 코드가 따로 필요 없다.
    const reader = new FileReader();
    reader.onload = () => isLatest() && onChange({ file: selected, previewUrl: String(reader.result) });
    reader.onerror = () => isLatest() && toast.error("이미지를 읽지 못했습니다.");
    reader.readAsDataURL(selected);
  };

  if (image) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-line">
        {/* 사용자가 고른 로컬 이미지라 next/image 최적화 대상이 아니다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.previewUrl} alt="프로젝트 사진 미리보기" className="h-72 w-full object-cover" />
        <button
          type="button"
          aria-label="프로젝트 사진 삭제"
          disabled={disabled}
          onClick={() => {
            // 처리 중인 선택이 삭제 뒤에 다시 나타나지 않게 한다.
            latestSelection.current++;
            onChange(null);
          }}
          className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-scrim text-white transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          <CloseIcon aria-hidden="true" className="size-3.25" />
        </button>
        <p className="absolute inset-x-0 bottom-0 truncate bg-scrim px-3 py-2 text-[11px] leading-[16.5px] text-white/80">
          {image.file.name}
        </p>
      </div>
    );
  }

  return (
    <label
      className={`flex h-[42px] w-full items-center gap-2 rounded-md border border-line px-3.25 text-[13px] leading-[19.5px] text-soft transition-colors focus-within:border-brand ${
        disabled ? "opacity-50" : "cursor-pointer hover:bg-wash"
      }`}
    >
      <UploadIcon aria-hidden="true" className="size-3.25 shrink-0" />
      클릭하여 이미지 선택 (1장)
      <input type="file" accept="image/*" disabled={disabled} onChange={handleChange} className="sr-only" />
    </label>
  );
}
