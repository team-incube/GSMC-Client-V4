// 프로젝트 참여 점수 상태(서버 ScoreStatus)에, 점수를 아직 내지 않은 DRAFT(미작성)를 더한 값이다.
export type ProjectStatus = "DRAFT" | "INCOMPLETE" | "PENDING" | "APPROVED" | "REJECTED";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  // DataGSM에 등록된 아이콘이 없으면 null이다.
  logoUrl: string | null;
  status: ProjectStatus;
};
