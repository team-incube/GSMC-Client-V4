import { graphqlRequest } from "@repo/lib";

const CREATE_PRESIGNED_UPLOAD_URL = `
  mutation($input: CreatePresignedUploadUrlInput!) {
    createPresignedUploadUrl(input: $input) {
      presignedUrl
      fileKey
    }
  }
`;

const CONFIRM_FILE_UPLOAD = `
  mutation($input: ConfirmFileUploadInput!) {
    confirmFileUpload(input: $input) {
      fileId
    }
  }
`;

type CreatePresignedUploadUrlResponse = {
  createPresignedUploadUrl: { presignedUrl: string; fileKey: string };
};

type ConfirmFileUploadResponse = {
  confirmFileUpload: { fileId: string };
};

// 서버(MAX_FILE_SIZE_BYTES)와 같은 값이다.
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

// presigned URL로 스토리지에 직접 올린 뒤 서버에 업로드 완료를 알리고, 확정된 파일 ID를 돌려준다.
export async function uploadFile(file: File) {
  const contentType = file.type || "application/octet-stream";

  const { createPresignedUploadUrl } = await graphqlRequest<CreatePresignedUploadUrlResponse>(
    CREATE_PRESIGNED_UPLOAD_URL,
    { input: { fileName: file.name, fileSize: file.size, contentType } },
  );

  // 스토리지는 외부 호스트라 액세스 토큰이 붙는 apiClient 대신 fetch를 쓴다.
  // presigned URL은 Content-Type까지 서명하므로 발급할 때와 같은 값을 보내야 한다.
  const response = await fetch(createPresignedUploadUrl.presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!response.ok) throw new Error("파일을 업로드하지 못했습니다.");

  const { confirmFileUpload } = await graphqlRequest<ConfirmFileUploadResponse>(CONFIRM_FILE_UPLOAD, {
    input: { fileKey: createPresignedUploadUrl.fileKey, originalFileName: file.name },
  });
  return confirmFileUpload.fileId;
}
