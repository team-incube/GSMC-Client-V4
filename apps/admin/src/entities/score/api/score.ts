import { graphqlRequest } from "@repo/lib";
import type { PendingScoreFilter, PendingScoresResponse } from "./types";;

// 서버가 허용하는 페이지당 최대 결과 수
const PAGE_SIZE = 100;

const PENDING_SCORES = `
  query($input: SearchPendingScoreInput!) {
    pendingScores(input: $input) {
      items {
        categoryType
        categoryKoreanName
        member { id name grade classNumber number }
        score {
          scoreId
          activityName
          scoreValue
          updatedAt
          activityDate
          competitionType
          submittedCategoryType
          dgProjectId
          file { originalName uri }
          evidence { title content files { originalName uri } }
        }
      }
      totalPages
    }
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

async function fetchPendingPage(filter: PendingScoreFilter, page: number) {
  const { pendingScores } = await graphqlRequest<PendingScoresResponse>(PENDING_SCORES, {
    input: {
      grade: filter.grade ?? undefined,
      classNumber: filter.classNumber ?? undefined,
      limit: PAGE_SIZE,
      page,
    },
  });
  return pendingScores;
}

// 페이지를 끝까지 이어 받아 조건에 맞는 심사 대기 점수 전체를 최근 수정순으로 돌려준다.
export async function fetchPendingScoreItems(filter: PendingScoreFilter) {
  const first = await fetchPendingPage(filter, 0);
  const restPages = Array.from({ length: Math.max(first.totalPages - 1, 0) }, (_, i) => i + 1);
  const rest = await Promise.all(restPages.map((page) => fetchPendingPage(filter, page)));
  return [first, ...rest].flatMap((result) => result.items);
}

export async function approveScore(scoreId: string) {
  await graphqlRequest(APPROVE_SCORE, { scoreId });
}

export async function rejectScore(scoreId: string, rejectionReason: string) {
  await graphqlRequest(REJECT_SCORE, { scoreId, input: { rejectionReason } });
}
