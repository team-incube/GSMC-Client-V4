import { GraphqlRequestError, graphqlRequest } from "@repo/lib";
import type { Project, ProjectStatus } from "../model/types";

// DataGSM에서 내가 참여자로 등록된 진행 중(ACTIVE) 프로젝트. 학생만 조회할 수 있다.
// TODO: 서버에 로고와 작성 상태가 추가되면(team-incube/GSMC-Server-V4#304) 필드 이름을 확인해 아래 두 줄을 쿼리에 넣는다.
//   logoUrl
//   myScoreStatus
// 서버에 없는 필드를 요청하면 쿼리 전체가 거부되므로, 배포 전에는 넣지 않는다.
const MY_WRITABLE_DATAGSM_PROJECTS = `
  query {
    myWritableDataGsmProjects {
      dgProjectId
      name
    }
  }
`;

type ScoreStatus = Exclude<ProjectStatus, "DRAFT">;

type MyWritableDataGsmProjectsResponse = {
  myWritableDataGsmProjects: {
    dgProjectId: string;
    name: string;
    // 쿼리에 넣기 전에는 응답에 키 자체가 없다.
    logoUrl?: string | null;
    // 작성한 점수가 없으면 null이다.
    myScoreStatus?: ScoreStatus | null;
  }[];
};

export async function fetchMyProjects(): Promise<Project[]> {
  const { myWritableDataGsmProjects } =
    await graphqlRequest<MyWritableDataGsmProjectsResponse>(MY_WRITABLE_DATAGSM_PROJECTS);
  return myWritableDataGsmProjects.map(({ dgProjectId, name, logoUrl, myScoreStatus }) => ({
    id: dgProjectId,
    title: name,
    logoUrl: logoUrl ?? null,
    // undefined(서버가 상태를 주지 않음)와 null(점수 없음 = 미작성)을 구분한다.
    status: myScoreStatus === undefined ? undefined : (myScoreStatus ?? "DRAFT"),
  }));
}

// 학생이 아닌 사용자(교사 등)가 조회하면 서버가 FORBIDDEN을 돌려준다.
export function isForbiddenError(error: unknown) {
  return error instanceof GraphqlRequestError && error.code === "FORBIDDEN";
}
