import { GraphqlRequestError, graphqlRequest } from "@repo/lib";
import type { Project, ProjectStatus } from "../model/types";

// DataGSM에서 내가 참여자로 등록된 진행 중(ACTIVE) 프로젝트. 학생만 조회할 수 있다.
const MY_WRITABLE_DATAGSM_PROJECTS = `
  query {
    myWritableDataGsmProjects {
      dgProjectId
      name
      description
      logoUrl
      myScoreStatus
    }
  }
`;

type ScoreStatus = Exclude<ProjectStatus, "DRAFT">;

type MyWritableDataGsmProjectsResponse = {
  myWritableDataGsmProjects: {
    dgProjectId: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    // 작성한 점수가 없으면 null이다.
    myScoreStatus: ScoreStatus | null;
  }[];
};

export async function fetchMyProjects(): Promise<Project[]> {
  const { myWritableDataGsmProjects } =
    await graphqlRequest<MyWritableDataGsmProjectsResponse>(MY_WRITABLE_DATAGSM_PROJECTS);
  return myWritableDataGsmProjects.map(({ dgProjectId, name, description, logoUrl, myScoreStatus }) => ({
    id: dgProjectId,
    title: name,
    description,
    logoUrl,
    status: myScoreStatus ?? "DRAFT",
  }));
}

// 학생이 아닌 사용자(교사 등)가 조회하면 서버가 FORBIDDEN을 돌려준다.
export function isForbiddenError(error: unknown) {
  return error instanceof GraphqlRequestError && error.code === "FORBIDDEN";
}
