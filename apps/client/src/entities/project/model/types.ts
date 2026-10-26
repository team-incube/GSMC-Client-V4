export type ProjectStatus = "APPROVED" | "DRAFT";

export type Project = {
  id: string;
  title: string;
  // TODO: 내 프로젝트 목록 API가 상태를 주면 채운다.
  status?: ProjectStatus;
};
