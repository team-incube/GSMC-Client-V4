// 프로젝트 참여 점수 상태(서버 ScoreStatus)에, 점수를 아직 내지 않은 DRAFT(미작성)를 더한 값이다.
export type ProjectStatus = "DRAFT" | "INCOMPLETE" | "PENDING" | "APPROVED" | "REJECTED";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  // DataGSM에 등록된 아이콘이 없으면 null이다.
  logoUrl: string | null;
  status: ProjectStatus;
  participants: ProjectParticipant[];
};

// TODO: 서버가 참여자 역할을 주면 PM 여부를 추가한다. 지금은 DataGSM 참여자 정보에 역할이 없다.
export type ProjectParticipant = {
  id: string;
  name: string;
  // 학생이 아니면 null일 수 있다. 예: "2216"
  studentNumber: string | null;
};
