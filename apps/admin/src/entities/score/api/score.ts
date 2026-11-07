import { graphqlRequest, graphqlRequestPartial } from "@repo/lib";
import type { PendingScoresResponse } from "./types";

// 한 요청에 묶을 학생 수. 점수마다 파일·증빙까지 받아 응답이 커서 총점 조회보다 작게 잡는다.
const CHUNK_SIZE = 50;

const SCORE_FIELDS = `
  categoryType
  categoryKoreanName
  scores {
    scoreId
    activityName
    scoreValue
    updatedAt
    activityDate
    competitionType
    submittedCategoryType
    file { originalName uri }
    evidence { title content files { originalName uri } }
  }
`;

const APPROVE_SCORE = `
  mutation($scoreId: ID!) {
    approveScore(scoreId: $scoreId)
  }
`;

const REJECT_SCORE = `
  mutation($scoreId: ID!, $input: RejectScoreInput!) {
    rejectScore(scoreId: $scoreId, input: $input)
  }
`;

// 전체 심사 대기 목록 API가 없어, 별칭을 붙여 여러 학생의 대기 점수를 한 쿼리로 묶어 조회한다.
async function fetchPendingChunk(memberIds: string[]) {
  const params = memberIds.map((_, i) => `$m${i}: ID!`).join(", ");
  const fields = memberIds
    .map((_, i) => `s${i}: scoresByCategory(memberId: $m${i}, status: PENDING) {${SCORE_FIELDS}}`)
    .join("\n");
  const variables = Object.fromEntries(memberIds.map((id, i) => [`m${i}`, id]));

  // 한 학생이 실패해도 나머지는 살리고, 실패한 학생 수를 함께 돌려준다.
  const { data, errors } = await graphqlRequestPartial<PendingScoresResponse>(
    `query(${params}) {\n${fields}\n}`,
    variables,
  );
  const failed = new Set(errors.map((error) => error.path?.[0]));
  return {
    groups: memberIds.map((id, i) => [id, data[`s${i}`] ?? []] as const),
    failedCount: memberIds.filter((_, i) => failed.has(`s${i}`)).length,
  };
}

export async function fetchPendingScoreGroups(memberIds: string[]) {
  const chunks: string[][] = [];
  for (let i = 0; i < memberIds.length; i += CHUNK_SIZE) chunks.push(memberIds.slice(i, i + CHUNK_SIZE));

  const results = await Promise.allSettled(chunks.map(fetchPendingChunk));
  // 하나도 받지 못했으면(예: 인증 만료) 빈 목록 대신 실패로 알린다.
  const firstFailure = results.find((result) => result.status === "rejected");
  if (firstFailure && results.every((result) => result.status === "rejected")) throw firstFailure.reason;

  let failedCount = 0;
  const groups = results.flatMap((result, i) => {
    if (result.status === "fulfilled") {
      failedCount += result.value.failedCount;
      return result.value.groups;
    }
    failedCount += chunks[i].length;
    return [];
  });
  return { groups, failedCount };
}

export async function approveScore(scoreId: string) {
  await graphqlRequest(APPROVE_SCORE, { scoreId });
}

export async function rejectScore(scoreId: string, rejectionReason: string) {
  await graphqlRequest(REJECT_SCORE, { scoreId, input: { rejectionReason } });
}
