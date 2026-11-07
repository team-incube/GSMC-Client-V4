import { graphqlRequest } from "@repo/lib";
import type { Project } from "../model/types";

const MY_PROJECTS = `
  query {
    myProjects {
      id
      title
    }
  }
`;

const CREATE_PROJECT = `
  mutation($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
    }
  }
`;

type MyProjectsResponse = {
  myProjects: { id: string; title: string }[];
};

type CreateProjectResponse = {
  createProject: { id: string };
};

export type CreateProjectInput = {
  title: string;
  description: string;
  fileIds: string[];
  participantIds: string[];
};

export async function fetchMyProjects(): Promise<Project[]> {
  const { myProjects } = await graphqlRequest<MyProjectsResponse>(MY_PROJECTS);
  return myProjects;
}

// 작성자는 서버가 참여자에 자동으로 넣는다.
export async function createProject(input: CreateProjectInput) {
  const { createProject } = await graphqlRequest<CreateProjectResponse>(CREATE_PROJECT, { input });
  return createProject.id;
}
