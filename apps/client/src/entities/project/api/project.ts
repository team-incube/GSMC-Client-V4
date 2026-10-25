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

type MyProjectsResponse = {
  myProjects: { id: string; title: string }[];
};

export async function fetchMyProjects(): Promise<Project[]> {
  const { myProjects } = await graphqlRequest<MyProjectsResponse>(MY_PROJECTS);
  return myProjects;
}
