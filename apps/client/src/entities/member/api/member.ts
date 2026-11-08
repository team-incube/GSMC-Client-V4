import { graphqlRequest } from "@repo/lib";
import type { Student } from "../model/types";

const SEARCH_STUDENTS = `
  query($input: SearchMemberInput!) {
    searchMembers(input: $input) {
      members {
        id
        name
        grade
        classNumber
        number
      }
      totalPages
    }
  }
`;

type SearchStudentsResponse = {
  searchMembers: { members: Student[]; totalPages: number };
};

// 서버가 허용하는 페이지 크기 최댓값이다.
const PAGE_SIZE = 100;

async function fetchStudentsPage(page: number) {
  const { searchMembers } = await graphqlRequest<SearchStudentsResponse>(SEARCH_STUDENTS, {
    input: { role: "STUDENT", limit: PAGE_SIZE, page },
  });
  return searchMembers;
}

// 서버의 이름 검색은 정확히 일치만 지원해, 초성·부분 검색을 하려고 학생 전체를 받아 클라이언트에서 거른다.
// 첫 페이지의 totalPages로 나머지 페이지를 한 번에 요청한다.
// ponytail: 학생 수(수백 명) 기준으로 전부 받는다. 수천 명 규모가 되면 서버 부분 검색으로 바꾼다.
export async function fetchAllStudents() {
  const first = await fetchStudentsPage(0);
  const restPages = Array.from({ length: Math.max(first.totalPages - 1, 0) }, (_, i) => i + 1);
  const rest = await Promise.all(restPages.map(fetchStudentsPage));
  return [first, ...rest].flatMap((result) => result.members);
}
