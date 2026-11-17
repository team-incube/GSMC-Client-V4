import { graphqlRequest, GraphqlRequestError } from "@repo/lib";
import type { DataGsmProject } from "../model/types";

const DATAGSM_PROJECT = `
  query($dgProjectId: ID!) {
    dataGsmProject(dgProjectId: $dgProjectId) {
      dgProjectId
      name
      description
      startYear
      endYear
      status
      logoUrl
      club { clubName }
      participants { participantId participantName studentNumber }
    }
  }
`;

type DataGsmProjectResponse = {
  dataGsmProject: {
    dgProjectId: string;
    name: string;
    description: string | null;
    startYear: number | null;
    endYear: number | null;
    status: DataGsmProject["status"];
    logoUrl: string | null;
    club: { clubName: string } | null;
    participants: { participantId: string; participantName: string; studentNumber: string | null }[];
  };
};

export async function fetchDataGsmProject(dgProjectId: string): Promise<DataGsmProject> {
  const { dataGsmProject } = await graphqlRequest<DataGsmProjectResponse>(DATAGSM_PROJECT, { dgProjectId });
  const { name, description, startYear, endYear, status, logoUrl, club, participants } = dataGsmProject;
  return {
    id: dataGsmProject.dgProjectId,
    name,
    description,
    startYear,
    endYear,
    status,
    logoUrl,
    clubName: club?.clubName ?? null,
    participants: participants.map(({ participantId, participantName, studentNumber }) => ({
      id: participantId,
      name: participantName,
      studentNumber,
    })),
  };
}

// 서버가 DataGSM에서 프로젝트를 찾지 못하면 DATAGSM_PROJECT_NOT_FOUND(또는 NOT_FOUND)로 응답한다.
export function isNotFoundError(error: unknown) {
  return error instanceof GraphqlRequestError && error.code.endsWith("NOT_FOUND");
}
