import { apiClient } from "./axios";

const GRAPHQL_ENDPOINT = "/graphql";

type GraphqlError = {
  message?: string;
  code?: string;
  extensions?: { code?: string };
};

type GraphqlResponse<T> = {
  data?: T | null;
  errors?: GraphqlError[];
};

export class GraphqlRequestError extends Error {
  readonly code: string;

  constructor(error: GraphqlError) {
    const code = error.extensions?.code ?? error.code ?? "UNKNOWN";
    super(error.message ?? code);
    this.name = "GraphqlRequestError";
    this.code = code;
  }
}

// 서버는 항상 200을 돌려주므로, 응답의 errors로 실패를 판단한다.
export async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const { data } = await apiClient.post<GraphqlResponse<T>>(GRAPHQL_ENDPOINT, { query, variables });
  const [error] = data.errors ?? [];
  if (error) throw new GraphqlRequestError(error);
  if (data.data == null) throw new GraphqlRequestError({ message: "응답 데이터가 없습니다." });
  return data.data;
}
