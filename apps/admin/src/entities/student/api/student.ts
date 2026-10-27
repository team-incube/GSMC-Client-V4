import { graphqlRequest } from "@repo/lib";
import type { StudentFilter } from "../model/types";
import type { MemberDto, ScoresByCategoryResponse, SearchMembersResponse, TotalScoresResponse } from "./types";

// 서버가 허용하는 페이지당 최대 결과 수
const PAGE_SIZE = 100;

const SEARCH_MEMBERS = `
  query($input: SearchMemberInput!) {
    searchMembers(input: $input) {
      members { id name email grade classNumber number }
      totalPages
    }
  }
`;

const SCORES_BY_CATEGORY = `
  query($memberId: ID!) {
    scoresByCategory(memberId: $memberId) {
      categoryType
      recognizedScore
    }
  }
`;

async function fetchMembersPage(filter: StudentFilter, page: number) {
  const { searchMembers } = await graphqlRequest<SearchMembersResponse>(SEARCH_MEMBERS, {
    input: {
      role: "STUDENT",
      grade: filter.grade ?? undefined,
      classNumber: filter.classNumber ?? undefined,
      limit: PAGE_SIZE,
      page,
    },
  });
  return searchMembers;
}

// 페이지를 끝까지 이어 받아 조건에 맞는 학생 전체를 돌려준다.
export async function fetchStudentMembers(filter: StudentFilter) {
  const first = await fetchMembersPage(filter, 0);
  const restPages = Array.from({ length: Math.max(first.totalPages - 1, 0) }, (_, i) => i + 1);
  const rest = await Promise.all(restPages.map((page) => fetchMembersPage(filter, page)));
  return [first, ...rest].flatMap((result) => result.members);
}

// 학생마다 요청하지 않도록, 별칭을 붙여 한 쿼리에 여러 학생의 총점을 묶어 조회한다.
async function fetchTotalScoreChunk(memberIds: string[]) {
  const params = memberIds.map((_, i) => `$m${i}: ID!`).join(", ");
  const fields = memberIds.map((_, i) => `s${i}: totalScore(memberId: $m${i}) { totalScore }`).join("\n");
  const variables = Object.fromEntries(memberIds.map((id, i) => [`m${i}`, id]));

  const data = await graphqlRequest<TotalScoresResponse>(`query(${params}) {\n${fields}\n}`, variables);
  return memberIds.map((id, i) => [id, data[`s${i}`]?.totalScore ?? 0] as const);
}

export async function fetchTotalScores(members: MemberDto[]) {
  const ids = members.map((member) => member.id);
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += PAGE_SIZE) chunks.push(ids.slice(i, i + PAGE_SIZE));

  const results = await Promise.all(chunks.map(fetchTotalScoreChunk));
  return new Map(results.flat());
}

export async function fetchScoresByCategory(memberId: string) {
  const { scoresByCategory } = await graphqlRequest<ScoresByCategoryResponse>(SCORES_BY_CATEGORY, { memberId });
  return scoresByCategory;
}
