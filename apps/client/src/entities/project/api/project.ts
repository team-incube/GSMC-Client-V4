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
      club {
        clubName
      }
      myScoreStatus
      participants {
        participantId
        participantName
        studentNumber
      }
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
    club: { clubName: string } | null;
    // 작성한 점수가 없으면 null이다.
    myScoreStatus: ScoreStatus | null;
    participants: {
      participantId: string;
      participantName: string;
      studentNumber: string | null;
    }[];
  }[];
};

export async function fetchMyProjects(): Promise<Project[]> {
  const { myWritableDataGsmProjects } =
    await graphqlRequest<MyWritableDataGsmProjectsResponse>(MY_WRITABLE_DATAGSM_PROJECTS);
  return myWritableDataGsmProjects.map(({ dgProjectId, name, description, logoUrl, club, myScoreStatus, participants }) => ({
    id: dgProjectId,
    title: name,
    description,
    logoUrl,
    clubName: club?.clubName ?? null,
    status: myScoreStatus ?? "DRAFT",
    participants: participants.map(({ participantId, participantName, studentNumber }) => ({
      id: participantId,
      name: participantName,
      studentNumber,
    })),
  }));
}

const SUBMIT_PROJECT_PARTICIPATION = `
  mutation($dgProjectId: ID!, $input: SubmitProjectParticipationInput!) {
    submitProjectParticipation(dgProjectId: $dgProjectId, input: $input) {
      scoreId
    }
  }
`;

type SubmitProjectParticipationResponse = {
  submitProjectParticipation: { scoreId: string };
};

type SubmitProjectParticipationParams = {
  projectId: string;
  content: string;
};

export async function submitProjectParticipation({ projectId, content }: SubmitProjectParticipationParams) {
  const { submitProjectParticipation } = await graphqlRequest<SubmitProjectParticipationResponse>(
    SUBMIT_PROJECT_PARTICIPATION,
    { dgProjectId: projectId, input: { content, fileIds: [] } },
  );
  return submitProjectParticipation.scoreId;
}

// 학생이 아닌 사용자(교사 등)가 조회하면 서버가 FORBIDDEN을 돌려준다.
export function isForbiddenError(error: unknown) {
  return error instanceof GraphqlRequestError && error.code === "FORBIDDEN";
}
