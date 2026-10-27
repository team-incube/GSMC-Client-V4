export type MemberDto = {
  id: string;
  name: string;
  email: string;
  grade: number | null;
  classNumber: number | null;
  number: number | null;
};

export type SearchMembersResponse = {
  searchMembers: {
    members: MemberDto[];
    totalPages: number;
  };
};

// 별칭(s0, s1, ...)으로 여러 학생의 총점을 한 번에 조회한 응답
export type TotalScoresResponse = Record<string, { totalScore: number }>;

export type ScoresByCategoryResponse = {
  scoresByCategory: { categoryType: string; recognizedScore: number }[];
};
