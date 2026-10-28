type CurrentFileProps = {
  fileName?: string;
  // 새 파일을 골랐으면 기존 파일을 지운 것처럼 보여 준다.
  replaced: boolean;
};

export function CurrentFile({ fileName, replaced }: CurrentFileProps) {
  if (!fileName) return null;
  return (
    <p className="truncate text-[12px] leading-[18px] text-soft">
      현재 파일: <span className={replaced ? "text-faint line-through" : "text-body"}>{fileName}</span>
    </p>
  );
}
