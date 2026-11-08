const MAX_DIMENSION = 1920;
const QUALITY = 0.8;
// 애니메이션(GIF)이나 벡터(SVG)는 canvas를 거치면 망가지므로 원본을 쓴다.
const SKIP_TYPES = ["image/gif", "image/svg+xml"];

function toBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

// 업로드 시간을 줄이려고 긴 변을 MAX_DIMENSION 이하로 줄이고 WebP(미지원 브라우저는 JPEG)로 다시 인코딩한다.
// 디코딩에 실패하거나(HEIC 등) 결과가 원본보다 크면 원본을 그대로 돌려준다.
export async function compressImage(file: File): Promise<File> {
  if (SKIP_TYPES.includes(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    // 지원하지 않는 형식을 요청하면 브라우저가 PNG로 돌려주므로 type으로 확인한다.
    let blob = await toBlob(canvas, "image/webp");
    if (blob?.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg");
    if (!blob || blob.size >= file.size) return file;

    const extension = blob.type === "image/webp" ? "webp" : "jpg";
    const name = file.name.replace(/\.[^.]+$/, "") + `.${extension}`;
    return new File([blob], name, { type: blob.type });
  } catch {
    return file;
  }
}
