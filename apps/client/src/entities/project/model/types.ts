// 프로젝트 참여 점수 상태(서버 ScoreStatus)에, 점수를 아직 내지 않은 DRAFT(미작성)를 더한 값이다.
export type ProjectStatus = "DRAFT" | "INCOMPLETE" | "PENDING" | "APPROVED" | "REJECTED";

export type Project = {
  id: string;
  title: string;
  // TODO: 내 프로젝트 목록 API가 상태를 주면 채운다.
  status?: ProjectStatus;
};
