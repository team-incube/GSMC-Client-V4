import { apiClient } from "./axios";

const GRAPHQL_ENDPOINT = "/graphql";

export type GraphqlError = {
  message?: string;
  code?: string;
  extensions?: { code?: string };
  // 에러가 난 필드의 위치. 첫 요소가 최상위 필드 이름(별칭)이다.
  path?: (string | number)[];
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

// 여러 필드를 한 쿼리로 묶을 때 쓴다. 일부 필드만 실패하면 던지지 않고, 성공한 데이터와 에러를 함께 돌려준다.
// 실패한 필드는 data에서 null이고, 해당 에러의 path[0]이 그 필드 이름이다.
export async function graphqlRequestPartial<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<{ data: T; errors: GraphqlError[] }> {
  const { data } = await apiClient.post<GraphqlResponse<T>>(GRAPHQL_ENDPOINT, { query, variables });
  const errors = data.errors ?? [];
  if (data.data == null) throw new GraphqlRequestError(errors[0] ?? { message: "응답 데이터가 없습니다." });
  return { data: data.data, errors };
}
