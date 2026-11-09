// 프로젝트 참여 점수 상태(서버 ScoreStatus)에, 점수를 아직 내지 않은 DRAFT(미작성)를 더한 값이다.
export type ProjectStatus = "DRAFT" | "INCOMPLETE" | "PENDING" | "APPROVED" | "REJECTED";

export type Project = {
  id: string;
  title: string;
  // 서버가 로고를 주지 않거나 로고가 없으면 null이다.
  logoUrl: string | null;
  // 서버가 작성 상태를 주기 전(GSMC-Server-V4#304)에는 undefined다.
  status?: ProjectStatus;
};
