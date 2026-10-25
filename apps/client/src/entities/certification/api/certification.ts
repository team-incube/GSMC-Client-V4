import { graphqlRequest } from "@repo/lib";
import type { MyMemberResponse, MyScoresResponse, MyTotalScoreResponse, ScoresByCategoryResponse } from "./types";

const MY_SCORES_BY_CATEGORY = `
  query {
    myScoresByCategory {
      categoryType
      categoryEnglishName
      categoryKoreanName
      recognizedScore
      scores { scoreId activityName scoreStatus }
    }
  }
`;

const MY_SCORES = `
  query {
    myScores {
      scoreId
      scoreStatus
      activityName
      scoreValue
      updatedAt
    }
  }
`;

const MY_TOTAL_SCORE = `
  query($includeApprovedOnly: Boolean) {
    myTotalScore(includeApprovedOnly: $includeApprovedOnly) {
      totalScore
    }
  }
`;

const MY_MEMBER = `
  query {
    myMember {
      name
    }
  }
`;

export async function fetchMyName() {
  const { myMember } = await graphqlRequest<MyMemberResponse>(MY_MEMBER);
  return myMember.name;
}

export async function fetchMyScoresByCategory() {
  const { myScoresByCategory } = await graphqlRequest<ScoresByCategoryResponse>(MY_SCORES_BY_CATEGORY);
  return myScoresByCategory;
}

export async function fetchMyScores() {
  const { myScores } = await graphqlRequest<MyScoresResponse>(MY_SCORES);
  return myScores;
}

export async function fetchMyTotalScore() {
  const { myTotalScore } = await graphqlRequest<MyTotalScoreResponse>(MY_TOTAL_SCORE, { includeApprovedOnly: true });
  return myTotalScore.totalScore;
}
