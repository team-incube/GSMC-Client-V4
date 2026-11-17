export type DataGsmProjectStatus = "ACTIVE" | "ENDED";

export type DataGsmProject = {
  id: string;
  name: string;
  description: string | null;
  startYear: number | null;
  endYear: number | null;
  status: DataGsmProjectStatus;
  // DataGSM에 등록된 아이콘이 없으면 null이다.
  logoUrl: string | null;
  clubName: string | null;
  participants: DataGsmProjectParticipant[];
};

export type DataGsmProjectParticipant = {
  id: string;
  name: string;
  // 학생이 아니면 null일 수 있다. 예: "2216"
  studentNumber: string | null;
};
